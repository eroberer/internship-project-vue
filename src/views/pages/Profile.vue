<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Profili Düzenle</strong>
          </div>

          <b-form-group
            label="Ad Soyad"
            :label-cols="3"
            :horizontal="true">
             <b-form-input type="text" v-model="fullname"></b-form-input>
          </b-form-group>

          <b-form-group
            label="Şifre"
            :label-cols="3"
            :horizontal="true">
             <b-form-input type="text" v-model="password"></b-form-input>
          </b-form-group>

          <b-form-group
            label="Fotoğraf"
            :label-cols="3"
            :horizontal="true">
                <b-form-file v-model="photo" placeholder="Dosya seçiniz" accept="image/*"></b-form-file>
            </b-form-group>


          <div slot="footer">
            <b-button type="button" size="sm" variant="primary" v-on:click="saveProfile"><i class="fa fa-dot-circle-o"></i> Kaydet</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "Profile",

  data() {
    return {
      fullname: "",
      password: "",
      photo: null
    };
  },

  created() {
    var info = JSON.parse(sessionStorage.getItem("info"));
    this.fullname = info.ad_soyad;
  },

  methods: {
    saveProfile() {
      if (!this.fullname || !this.password) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Hesap/Duzenle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("kullanici_id", sessionStorage.getItem("userId"));
      data.append("ad_soyad", this.fullname);
      data.append("sifre", this.password);
      data.append("resim", this.photo);

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
            alert("Profil başarıyla güncellendi!");
          }
        });
    }
  }
};
</script>
