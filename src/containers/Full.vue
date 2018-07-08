<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import nav from "../_nav";
import {
  Header as AppHeader,
  Sidebar,
  Footer as AppFooter,
  Breadcrumb
} from "../components/";

export default {
  name: "full",
  components: {
    AppHeader,
    Sidebar,
    AppFooter,
    Breadcrumb
  },

  data() {
    return {
      nav: []
    };
  },

  created() {
    var userRank = sessionStorage.getItem("rank");
    if (userRank == 1) {
      this.nav = [
        {
          name: "Stajlarım",
          url: "/student/internlist",
          icon: "icon-speedometer"
        },
        {
          name: "Yeni Staj",
          url: "/student/internadd",
          icon: "icon-speedometer"
        }
      ];
    } else if (userRank == 2) {
      this.nav = [
        {
          name: "Personel Listesi",
          url: "/company/memberlist",
          icon: "icon-speedometer"
        },
        {
          name: "Personel Ekle",
          url: "/company/memberadd",
          icon: "icon-speedometer"
        },
        {
          name: "Stajlar",
          url: "/company/oldinternlist",
          icon: "icon-speedometer"
        },
        {
          name: "Staj Başvuruları",
          url: "/company/companyinternlist",
          icon: "icon-speedometer"
        },
        {
          name: "Değerlendirilecek Stajlar",
          url: "/company/confirmedinternlist",
          icon: "icon-speedometer"
        }
      ];
    } else if (userRank == 4) {
      this.nav = [
        {
          name: "Fakülteler",
          url: "/school/faculty",
          icon: "icon-speedometer"
        },
        {
          name: "Bölümler",
          url: "/school/department",
          icon: "icon-speedometer"
        },
        {
          name: "Öğrenciler",
          url: "/school/student",
          icon: "icon-speedometer"
        },
        {
          name: "Öğretim Görevlileri",
          url: "/school/teacher",
          icon: "icon-speedometer"
        },
        {
          name: "Staj Başvuruları",
          url: "/school/schoolinternlist",
          icon: "icon-speedometer"
        },
        {
          name: "Değerlendirelecek Stajlar",
          url: "/school/schoolconfirmedinternlist",
          icon: "icon-speedometer"
        }
      ];
    }
  },
  computed: {
    name() {
      return this.$route.name;
    },
    list() {
      return this.$route.matched;
    }
  }
};
</script>
