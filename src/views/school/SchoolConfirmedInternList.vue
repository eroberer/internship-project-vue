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
                <b-button variant="primary" :to="{ name: 'SchoolInternDetail', params: data.item }">Stajı Değerlendir</b-button>
            </template>

          </b-table>

        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "SchoolConfirmedInternList",
  data() {
    return {
      fields: ["Ad Soyad", "Eposta","Firma Adı", "Bölüm", "Başlangıç", "Bitiş", "Değerlendir"],
      interns: []
    };
  },

  created() {
    this.getInternList();
  },

  methods: {

    getInternList() {
      this.interns = [];
      const url = "http://bitirme.emre.pw/Okul/Stajlar";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("id", JSON.parse(sessionStorage.getItem("info")).bolumler.length == 0 ? 0 : JSON.parse(sessionStorage.getItem("info")).bolumler[0].bolum_id);

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
            resJson.stajlar.map(item => {
              if (item.sonuc == 4)
                this.interns.push({
                  id: item.staj_id,
                  "Ad Soyad": item.ad_soyad,
                  "Firma Adı": item.firma_adi,
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
