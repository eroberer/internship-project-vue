<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Stajlar</strong>
          </div>

          <b-table  striped hover :items="interns" :fields="fields"></b-table>

        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "OldInternList",
  data() {
    return {
      fields: ["Ad Soyad", "Eposta", "Bölüm", "Başlangıç", "Bitiş", "Sonuç"],
      interns: []
    };
  },

  created() {
    this.getInternList();
  },

  methods: {
    getInternList() {
      this.interns = [];
      const url = "http://bitirme.emre.pw/Firma/StajListele";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append(
        "firma_id",
        JSON.parse(sessionStorage.getItem("info")).firmalar[0].firma_id
      );

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
              if (item.sonuc != 2)
                this.interns.push({
                  id: item.staj_id,
                  "Ad Soyad": item.ad_soyad,
                  Bölüm: item.bolum_adi,
                  Eposta: item.eposta,
                  Başlangıç: item.baslangic_tarih.split(" ")[0],
                  Bitiş: item.bitis_tarih.split(" ")[0],
                  Sonuç: this.getInternResult(item.sonuc)
                });
            });
          }
        });
    },

    getInternResult(resultNumber) {
      var resultStr = "";
      switch (resultNumber) {
        case "-2":
          resultStr = "Okul Tarafından Reddedilmiş";
          break;
        case "-1":
          resultStr = "Firma Tarafından Reddedilmiş";
          break;
        case "0":
          resultStr = "Firma Onayı Bekliyor";
          break;
        case "1":
          resultStr = "Okul Onayı Bekliyor";
          break;
        case "2":
          resultStr = "Detay Girilebilir";
          break;
        case "3":
          resultStr = "Firmadan Sonuç Bekleniyor";
          break;
        case "4":
          resultStr = "Okuldan Sonuç Bekleniyor";
          break;
        case "5":
          resultStr = "Staj Tamamlanmış";
          break;
      }
      return resultStr;
    }
  }
};
</script>
