<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Stajlarım</strong>
          </div>

          <b-table  striped hover :items="interns" :fields="fields">
            
            <template slot="Durum" slot-scope="data">
              <div v-if="data.item.Durum == 0">
                Firma onayı bekleniyor
              </div>
              <div v-else-if="data.item.Durum == 1">
                Okul Onayı bekliyor
              </div>
              <div v-else-if="data.item.Durum == -1">
                Firma Tarafından Reddedilmiş
              </div>
              <div v-else-if="data.item.Durum == -2">
                Okul Tarafından Reddedilmiş
              </div>
              <div v-else-if="data.item.Durum >= 2">
                <b-button variant="primary" :to="{ name: 'InternDetail', params: data.item }">Staj Detay</b-button>
              </div>
            </template>
          </b-table>

        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "InternList",
  data() {
    return {
      fields:['Firma Adı', "Bölüm Adı", "Başlangıç", "Bitiş", "Durum"],
      interns: []
    };
  },

  created() {
    const url = "http://bitirme.emre.pw/Staj/Listele";

    var data = new FormData();
    data.append("token", sessionStorage.getItem("token"));
    data.append("kullanici_id", sessionStorage.getItem("userId"));

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
          resJson.stajlarim.map(item => {
            this.interns.push({
              "id":item.staj_id,
              "Firma Adı": item.firma_adi,
              "Bölüm Adı": item.bolum_adi,
              "Başlangıç": item.baslangic_tarih.split(" ")[0],
              "Bitiş": item.bitis_tarih.split(" ")[0],
              Durum: item.sonuc
            });
          });
        }
      });
  },

  methods: {
    click() {
      // do nothing
    }
  }
};
</script>
