<template>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          {{ getUserName() }}
          <img :src="image" class="img-avatar" width="40" height="40" style="border:1px solid #efefef">
        </template>
        <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
        <b-dropdown-item><i class="fa fa-user"></i> Profil</b-dropdown-item>
        <b-dropdown-item @click="logout"><i class="fa fa-lock"></i> Çıkış</b-dropdown-item>
      </b-nav-item-dropdown>
</template>
<script>
export default {
  name: "header-dropdown",
  data() {
    return {
      image: ""
    };
  },

  created() {
    this.image = JSON.parse(sessionStorage.getItem("info")).resim;
  },

  methods: {
    logout() {
      sessionStorage.clear();
      location.reload();
    },

    getUserName() {
      var user = JSON.parse(sessionStorage.getItem("info"));
      return user.ad_soyad;
    }
  }
};
</script>
