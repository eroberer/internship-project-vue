<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <b-row class="justify-content-center">
        <b-col md="6">
          <b-card-group>
            <b-card no-body class="p-4">
              <b-card-body>
                <h1>Login</h1>
                <p class="text-muted">Hesabına giriş yap</p>
                <div v-if="error" class="alert alert-danger no-border">{{error}}</div>
                <b-input-group class="mb-3">
                  <b-input-group-prepend><b-input-group-text><i class="icon-user"></i></b-input-group-text></b-input-group-prepend>
                  <input type="email" class="form-control" placeholder="Email" v-model="email">
                </b-input-group>
                <b-input-group class="mb-4">
                  <b-input-group-prepend><b-input-group-text><i class="icon-lock"></i></b-input-group-text></b-input-group-prepend>
                  <input type="password" class="form-control" placeholder="Parola" v-model="password">
                </b-input-group>
                <b-row>
                  <b-col cols="6">
                    <b-button variant="primary" class="px-4" v-on:click="handleLogin">Login</b-button>
                  </b-col>
                  <b-col cols="6" class="text-right">
                    <!-- <b-button variant="link" class="px-0">Forgot password?</b-button> -->
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",

  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },

  methods: {
    handleLogin() {
      if (!this.email || !this.password) {
        this.error = "Boş alan bırakmayınız!";
        return;
      }

      const url = "http://bitirme.emre.pw/Login";

      var data = new FormData();
      data.append("eposta", this.email);
      data.append("sifre", this.password);

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
            this.error = resJson.error;
          } else {
            sessionStorage.setItem("token", resJson.bilgiler.token);
            sessionStorage.setItem("userId", resJson.bilgiler.id);
            sessionStorage.setItem("rank", resJson.bilgiler.rutbe);
            sessionStorage.setItem("info", JSON.stringify(resJson.bilgiler));
            this.$router.push({ name: "Home" });
            location.reload();
          }
        });
    }
  }
};
</script>
