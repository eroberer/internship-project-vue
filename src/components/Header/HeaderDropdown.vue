<template>
      <b-nav-item-dropdown right no-caret>
        <template slot="button-content">
          {{ getUserName() }}
          <img src="static/img/avatars/6.jpg" class="img-avatar">
        </template>
        <b-dropdown-header tag="div" class="text-center"><strong>Account</strong></b-dropdown-header>
        <b-dropdown-item><i class="fa fa-user"></i> Profile</b-dropdown-item>
        <b-dropdown-item><i class="fa fa-wrench"></i> Settings</b-dropdown-item>
        <b-dropdown-item><i class="fa fa-lock"></i> Logout</b-dropdown-item>
      </b-nav-item-dropdown>
</template>
<script>
export default {
  name: "header-dropdown",
  data: () => {
    return { itemsCount: 42 };
  },
  methods: {
    getUserName() {
      var user = JSON.parse(sessionStorage.getItem("info"));
      return user.ad_soyad;
    }
  }
};
</script>
