<template>
</template>


<script>
export default {
  name: "Redirect",

  created() {
    var rank = sessionStorage.getItem("rank");

    if (rank == 1) {
      this.$router.push({ name: "Student" });
    } else if (rank == 2) {
      this.$router.push({ name: "Company" });
    }
  }

};
</script>