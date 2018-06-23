<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>{{ $route.params["Firma Adı"] }}</strong> ({{ $route.params["Başlangıç"] }} - {{ $route.params["Bitiş"] }})
            <span class="text-right">
             <b-button variant="success" @click="insertModalShow = !insertModalShow">
              Yeni Gün Ekle
            </b-button>
            </span>
            <b-modal @ok="handleSubmit" v-model="insertModalShow" title="Yeni Gün Ekle">

              <b-form-group
                label="Tarih"
                label-for="basicSelect"
                :label-cols="3"
                :horizontal="true">
                <b-form-input type="date" :min="minDate" multiple  :max="maxDate"  v-model="inputDate"></b-form-input>
              </b-form-group>

              <b-form-group
                label="Açıklama"
                label-for="basicSelect"
                :label-cols="3"
                :horizontal="true">
                <b-form-textarea id="textarea1"
                     v-model="textarea"
                     :rows="10">
                </b-form-textarea>
              </b-form-group>

               <b-form-group
                label="Resim veya Döküman"
                label-for="basicSelect"
                :label-cols="3"
                :horizontal="true">
                 <b-form-file v-model="file" multiple placeholder="Dosya seçiniz"></b-form-file>
              </b-form-group>

            </b-modal>
          </div>
     
          <b-table  striped hover :items="days" :fields="fields">
            <template slot="Açıklama" slot-scope="data">
              {{ data.item["Açıklama"].slice(0, 80) }} ...
            </template>

            <template slot="Resimler" slot-scope="data">
              {{ data.item["Resimler"].length }} adet dosya
            </template>

             <template slot="İşlem" slot-scope="data">
              <div v-if="$route.params.Durum == 2">

                <b-button variant="primary" @click="handleUpdateModal(data.item)">
                  Düzenle
                </b-button>

              </div>
              <div v-else-if="$route.params.Durum >= 2">
                Firma onayı bekleniyor
              </div>
            </template>
          </b-table> 

          <b-modal v-model="updateModalShow" @ok="updateDay" size="lg"  title="Staj Güncelle">
            <b-form-group
                label="Tarih"
                label-for="basicSelect"
                :label-cols="3"
                :horizontal="true">
                <b-form-input type="date" :min="minDate" multiple  :max="maxDate"  v-model="editDate"></b-form-input>
              </b-form-group>

              <b-form-group
                label="Açıklama"
                label-for="basicSelect"
                :label-cols="3"
                :horizontal="true">
                <b-form-textarea id="textarea1"
                     v-model="editText"
                     :rows="10">
                </b-form-textarea>
              </b-form-group>

               <b-form-group
                label="Resim veya Döküman"
                label-for="basicSelect"
                :label-cols="3"
                :horizontal="true">
                 <b-form-file v-model="editInputFile" multiple placeholder="Dosya seçiniz"></b-form-file>
              </b-form-group>

             <b-table  striped hover :items="editFileList" :fields="editFileFields">
             <template slot="işlem" slot-scope="data">
              <div v-if="$route.params.Durum == 2">
                <b-button variant="danger" @click="deleteFile(data.item.id)">
                  Dosyayı Sil
                </b-button>
              </div>
              <div v-else-if="$route.params.Durum > 2">
                Firma onayı bekleniyor
              </div>
            </template>
            </b-table> 

            </b-modal>
          </b-card>

      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "InternDetail",

  data() {
    return {
      internId: "",
      fields: [
        "Tarih",
        "Açıklama",
        "Resimler",
        "Firma Onay",
        "Okul Onay",
        "İşlem"
      ],
      days: [],
      insertModalShow: false,
      updateModalShow: false,
      // insert
      minDate: "",
      maxDate: "",
      inputDate: "",
      textarea: "",
      file: [],

      // update
      editDate: "",
      editText: "",
      editInputFile: [],
      editFileFields: ["id", "resim", "işlem"],
      editFileList: [],
      updateDayId: "",
    };
  },

  created() {
    if (this.$route.params.id === undefined)
      this.$router.push({ name: "InternList" });

    this.internId = this.$route.params.id;
    this.getInternDays(this.internId);

    this.minDate = this.$route.params["Başlangıç"];
    this.maxDate = this.$route.params["Bitiş"];
  },

  methods: {
    deleteFile(id) {
      if (confirm("Dosyayı Silmek istediğinize emin misin?")) {
        const url = "http://bitirme.emre.pw/Staj/RaporResimSil";

        var data = new FormData();
        data.append("token", sessionStorage.getItem("token"));
        data.append("kullanici_id", sessionStorage.getItem("userId"));
        data.append("resim_id", id);


        let fetchData = {
          method: "POST",
          body: data
        };

        fetch(url, fetchData)
          .then(res => {
            return res.json();
          })
          .then(resJson => {
            if (resJson.result == false) {
              if (resJson.error == -1) {
                sessionStorage.clear();
                location.reload();
              } else {
                alert(resJson.error);
              }
            } else {
              var temp = this.editFileList.filter(obj => obj.id != id);
              this.editFileList = temp;
            }
          });
      }
    },

    handleUpdateModal(data) {
      this.updateModalShow = !this.updateModalShow;
      this.editDate = data.Tarih;
      this.editText = data["Açıklama"];
      this.editFileList = data.Resimler;
      this.updateDayId = data.id;
    },

    updateDay() {
      if (!this.editText || !this.editFileList) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Staj/RaporDuzenle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("kullanici_id", sessionStorage.getItem("userId"));
      data.append("rapor_id", this.updateDayId);
      data.append("tarih", this.editDate);
      data.append("aciklama", this.textarea);

      if (this.editInputFile.length > 0) {
        for (let index = 0; index < this.editInputFile.length; index++) {
          data.append("resimler[]", this.editInputFile[index]);
        }
      } else {
        data.append("resimler[]", "");
      }
      console.log(data);
      let fetchData = {
        method: "POST",
        body: data
      };

      fetch(url, fetchData)
        .then(res => {
          return res.json();
        })
        .then(resJson => {
          if (resJson.result == false) {
            if (resJson.error == -1) {
              sessionStorage.clear();
              location.reload();
            } else {
              alert(resJson.error);
            }
          } else {
            this.getInternDays(this.internId);
          }
        });


    },

    handleSubmit() {
      if (!this.inputDate || !this.textarea) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Staj/RaporEkle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("kullanici_id", sessionStorage.getItem("userId"));
      data.append("staj_id", this.internId);
      data.append("tarih", this.inputDate);
      data.append("aciklama", this.textarea);

      if (this.file.length > 0) {
        for (let index = 0; index < this.file.length; index++) {
          data.append("resimler[]", this.file[index]);
        }
      } else {
        data.append("resimler[]", "");
      }

      let fetchData = {
        method: "POST",
        body: data
      };

      fetch(url, fetchData)
        .then(res => {
          return res.json();
        })
        .then(resJson => {
          if (resJson.result == false) {
            if (resJson.error == -1) {
              sessionStorage.clear();
              location.reload();
            } else {
              alert(resJson.error);
            }
          } else {
            this.getInternDays(this.internId);
          }
        });
    },

    getInternDays(internId) {
      const url = "http://bitirme.emre.pw/Staj/RaporListele";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("kullanici_id", sessionStorage.getItem("userId"));
      data.append("staj_id", internId);

      let fetchData = {
        method: "POST",
        body: data
      };

      fetch(url, fetchData)
        .then(res => {
          return res.json();
        })
        .then(resJson => {
          if (resJson.result == false) {
            if (resJson.error == -1) {
              sessionStorage.clear();
              location.reload();
            } else {
              alert(resJson.error);
            }
          } else {
            resJson.gunler.map(item => {
              this.days.push({
                id: item.id,
                Tarih: item.staj_tarihi.split(" ")[0],
                Açıklama: item.aciklama,
                "Firma Onay": item.firma_onay,
                "Okul Onay": item.okul_onay,
                Resimler: item.resimler
              });
            });
          }
        });
    }
  }
};
</script>
