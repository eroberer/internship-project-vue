<template>
</template>


<script>
export default {
  name: "Redirect",

  created() {
    var rank = sessionStorage.getItem("rank");

    if (rank == 1) {
      this.$router.push({ name: "Student" });
    } else if (rank == 2 || rank == 3) {
      this.$router.push({ name: "Company" });
    } else if (rank == 4 || rank == 5) {
      this.$router.push({ name: "SchoolInternList" });
    }
  }

};
</script>