<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Firmalar</strong>
          </div>

          <b-table  striped hover :items="companies" :fields="fields">
            
            <template slot="Onay Durumu" slot-scope="data">
                <b-button variant="success" @click="confirm(true, data.item.ID)">Onay</b-button>
                <b-button variant="danger" @click="confirm(false, data.item.ID)">Sil</b-button>
            </template>

          </b-table>

        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "CompanyList",
  data() {
    return {
      fields: ["id", "Firma Adı", "Onay Durumu"],
      companies: []
    };
  },

  created() {
    this.getCompanyList();
  },

  methods: {
    confirm(val, id) {
      var url = "http://bitirme.emre.pw/Okul/";
      
      url += val ? "FirmaOnayla" : "FirmaSil";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("id", id);

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
            this.getCompanyList();
          }
        });
    },

    getCompanyList() {
      this.companies = [];
      const url = "http://bitirme.emre.pw/Firma/Listele";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));

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
              if (item.onay == -1)
                this.companies.push({
                  ID: item.id,
                  "Firma Adı": item.adi
                });
            });
          }
        });
    }
  }
};
</script>
