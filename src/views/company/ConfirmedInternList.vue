<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Değerlendirilecek Stajlar</strong>
          </div>

          <b-table  striped hover :items="interns" :fields="fields">
            
            <template slot="Değerlendir" slot-scope="data">
                <b-button variant="primary" :to="{ name: 'CompanyInternDetail', params: data.item }">Stajı Değerlendir</b-button>
            </template>

          </b-table>

        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "ConfirmedInternList",
  data() {
    return {
      fields: ["Ad Soyad", "Eposta", "Bölüm", "Başlangıç", "Bitiş", "Değerlendir"],
      interns: []
    };
  },

  created() {
    this.getInternList();
  },

  methods: {
    confirm(val, id) {
      const url = "http://bitirme.emre.pw/Staj/SonucDegistir";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("sonuc", val ? 1 : -1);
      data.append("staj_id", id);

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
            this.getInternList();
          }
        });
    },

    getInternList() {
      this.interns = [];
      const url = "http://bitirme.emre.pw/Firma/StajListele";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("firma_id", JSON.parse(sessionStorage.getItem("info")).firmalar[0].firma_id);
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
            alert(resJson.error);
            if (resJson.error == -1) {
              sessionStorage.clear();
              location.reload();
              return -1;
            }
          } else {
            resJson.list.map(item => {
              if (item.sonuc == 3)
                this.interns.push({
                  id: item.staj_id,
                  "Ad Soyad": item.ad_soyad,
                  "Bölüm":item.bolum_adi,
                  Eposta: item.eposta,
                  Başlangıç: item.baslangic_tarih.split(" ")[0],
                  Bitiş: item.bitis_tarih.split(" ")[0]
                });
            });
          }
        });
    }
  }
};
</script>
