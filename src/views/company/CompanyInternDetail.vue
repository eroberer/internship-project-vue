<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <b-row>
              <b-col>
            <strong>{{ $route.params["Ad Soyad"] }}</strong> <br />({{ $route.params["Başlangıç"] }} - {{ $route.params["Bitiş"] }})
              </b-col>
                <b-col>
                    <b-row>
                      <b-col>İş Devam Durumu
                      <b-form-select v-model="point1" :options="pointOptions" class="mb-3">
                      </b-form-select>
                      </b-col>
                    </b-row>
                </b-col>

                <b-col>
                    <b-row>
                      <b-col>Çalışma Gayreti
                      <b-form-select v-model="point2" :options="pointOptions" class="mb-3">
                      </b-form-select>
                      </b-col>
                    </b-row>
                </b-col>

                <b-col>
                    <b-row>
                      <b-col>Zamanında Yapma
                      <b-form-select v-model="point3" :options="pointOptions" class="mb-3">
                      </b-form-select>
                      </b-col>
                    </b-row>
                </b-col>

                <b-col>
                    <b-row>
                      <b-col>İşyerinde ki davranışlar
                      <b-form-select v-model="point4" :options="pointOptions" class="mb-3">
                      </b-form-select>
                      </b-col>
                    </b-row>
                </b-col>

                <b-col>
                  <b-row>
                      <b-col><br />
              <b-button variant="danger" @click="submitSelectedDays">
                Tamamla
              </b-button>
              </b-col>
                    </b-row>
              </b-col>

            </b-row>
          </div>

          <b-table  striped hover :items="days" :fields="fields">
            <template slot="Günler" slot-scope="data">
              <b>{{ data.item["Tarih"] }}</b><br/>
              {{ data.item["Açıklama"] }} <br />

              <b-img
                height="100"
                width="100"
                style="margin:5px"
                v-for="image in data.item.Resimler"
                :key="image.id"
                @click="clickImage(image.resim)"
                :src="printImage(image.resim)">
              </b-img>

            </template>

             <template slot="İşlem" slot-scope="data">
               <b-form-checkbox @change="checkDay(data.item.id)">Seç</b-form-checkbox>
            </template>
          </b-table>

          </b-card>

      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "CompanyInternDetail",

  data() {
    return {
      internId: "",
      baseUrl: "",
      fields: ["id", "Günler", "İşlem"],
      selectedDays: [],
      days: [],
      pointOptions: [1, 2, 3, 4, 5],
      point1: 5,
      point2: 5,
      point3: 5,
      point4: 5
    };
  },

  created() {
    if (this.$route.params.id === undefined)
      this.$router.push({ name: "CompanyInternList" });

    this.internId = this.$route.params.id;
    this.getInternDays(this.internId);

    this.minDate = this.$route.params["Başlangıç"];
    this.maxDate = this.$route.params["Bitiş"];
  },

  methods: {
    submitSelectedDays() {
      var countOfSelectedDays = this.selectedDays.length;

      if (countOfSelectedDays == 0) {
        alert("Hiç gün onaylamadınız!");
        return;
      }

      if (!confirm(countOfSelectedDays + " gün seçtiniz.İşlemi bitirmek istediğinize emin misiniz?")) {
        return;
      }

      const url = "http://bitirme.emre.pw/Firma/StajDegerlendir";
      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("staj_id", this.internId);
      data.append("puan", this.point1 + "" +  this.point2  + "" +  this.point3  + "" +  this.point4);
      data.append("raporlar", "[" + this.selectedDays.toString() + "]");

      let fetchData = {
        method: "POST",
        body: data
      };

      return fetch(url, fetchData)
        .then(res => {
          return res.json();
        })
        .then(resJson => {
          if (resJson.result == false) {
            this.error = resJson.error;
            if (resJson.error == -1) {
              sessionStorage.clear();
              location.reload();
              return -1;
            }
          } else {
            alert("İşlem tamamlandı!");
            this.$router.push({ name: "Login" });
          }
        });
    },

    checkDay(id) {
      let isExistId = this.selectedDays.filter(e => e == id);

      if (isExistId.length == 0) {
        this.selectedDays.push(id);
      } else {
        let tempDays = this.selectedDays.filter(e => e != id);
        this.selectedDays = tempDays;
      }
    },

    printImage(image) {
      return this.baseUrl + image;
    },

    clickImage(image) {
      var win = window.open(this.baseUrl + image, "_blank");
      win.focus();
    },

    handleUpdateModal(data) {
      this.updateModalShow = !this.updateModalShow;
      this.editDate = data.Tarih;
      this.editText = data["Açıklama"];
      this.editFileList = data.Resimler;
      this.updateDayId = data.id;
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
            this.baseUrl = resJson.url;
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
