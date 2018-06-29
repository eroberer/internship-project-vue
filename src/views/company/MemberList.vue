<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Personel Listesi</strong>
          </div>

          <b-table  striped hover :items="members" :fields="fields">
            
            <template slot="İşlem" slot-scope="data">
              <div v-if="showDelButton(data.item.id)">
                <b-button variant="danger" @click="deleteMember(data.item.id)">
                  Sil
                </b-button>
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
  name: "MemberList",
  data() {
    return {
      fields: ["Resim", "Ad Soyad", "Eposta", "Görev", "İşlem"],
      members: []
    };
  },

  created() {
    this.companyId = sessionStorage.getItem("userId");

    const url = "http://bitirme.emre.pw/Firma/PersonelListele";
    var data = new FormData();
    data.append("token", sessionStorage.getItem("token"));
    data.append("firma_id", sessionStorage.getItem("userId"));

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
          resJson.list.map(item => {
            this.members.push({
              id: item.kullanici_id,
              Resim: item.resim,
              "Ad Soyad": item.ad_soyad,
              Eposta: item.eposta,
              Görev: item.gorev
            });
          });
        }
      });
  },

  methods: {
    showDelButton(id) {
      return id != sessionStorage.getItem("userId")
    },

    deleteMember(id) {
      if (confirm("Personeli Silmek istediğinize emin misin?")) {
        const url = "http://bitirme.emre.pw/Firma/PersonelSil";

        var data = new FormData();
        data.append("token", sessionStorage.getItem("token"));
        data.append("firma_id", sessionStorage.getItem("userId"));
        data.append("personel_id", id);

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
              var temp = this.members.filter(obj => obj.id != id);
              this.members = temp;
            }
          });
      }
    }
  }
};
</script>
