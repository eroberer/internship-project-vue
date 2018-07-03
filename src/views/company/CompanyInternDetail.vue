<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>{{ $route.params["Ad Soyad"] }}</strong> ({{ $route.params["Başlangıç"] }} - {{ $route.params["Bitiş"] }})
            <span class="text-right">
             <b-button variant="danger" @click="insertModalShow">
              Bitir
            </b-button>
            </span>

          </div>
     
          <b-table  striped hover :items="days" :fields="fields">
            <template slot="Günler" slot-scope="data">
              <b>{{ data.item["Tarih"] }}</b><br/>
              {{ data.item["Açıklama"] }} <br />
              {{ data.item["Resimler"].length }}
              
            </template>

             <template slot="İşlem" slot-scope="data">
                <b-button variant="primary" @click="handleUpdateModal(data.item)">
                  Düzenle
                </b-button>
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
      fields: [
        "Günler",
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
