<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Yeni Personel Ekle</strong>
          </div>

          <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>

          <b-form-group
            label="E-mail"
            label-for="basicSelect"
            :label-cols="3"
            :horizontal="true">
             <b-form-input type="text" v-model="email"></b-form-input>
          </b-form-group>

          <b-form-group
            label="Parola"
            label-for="basicSelect"
            :label-cols="3"
            :horizontal="true">
             <b-form-input type="text" v-model="password"></b-form-input>
          </b-form-group>

          <div slot="footer">
            <b-button type="button" size="sm" variant="primary" v-on:click="handleSubmit"><i class="fa fa-dot-circle-o"></i> Kaydet</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "MemberAdd",

  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },

  methods: {
    checkInputs() {
      if (!this.email || !this.password) return false;
      return true;
    },

    addIntern(companyId) {
      const url = "http://bitirme.emre.pw/Firma/PersonelEkle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("firma_id", sessionStorage.getItem("userId"));
      data.append("eposta", this.email);
      data.append("sifre", this.password);

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
            this.$router.push({ name: "MemberList" });
          }
        });
    },

    handleSubmit() {
      if (this.checkInputs()) {
        this.error = "";
        this.addIntern();
      } else {
        this.error = "Lütfen boş alan bırakmayınız veya geçerli değer giriniz!";
      }
    }
  }
};
</script>
