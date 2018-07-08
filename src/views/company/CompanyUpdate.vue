<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Firma Bilgileri</strong>
          </div>

          <b-form-group
            label="Firma Adı"
            :label-cols="3"
            :horizontal="true">
             <b-form-input type="text" v-model="companyName"></b-form-input>
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
      companyId: null,
      companyName: "",
      photo: null
    };
  },

  created() {
    var info = JSON.parse(sessionStorage.getItem("info"));
    this.companyName = info.firmalar[0].adi;
    this.companyId = info.firmalar[0].firma_id;
  },

  methods: {
    saveProfile() {
      if (!this.companyName ) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Firma/Duzenle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("id", this.companyId);
      data.append("adi", this.companyName);
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
            var info = JSON.parse(sessionStorage.getItem("info"));
            info.firmalar[0].adi = this.companyName;
            sessionStorage.setItem("info", JSON.stringify(info));
            alert("Firma başarıyla güncellendi!");
            //location.reload();
          }
        });
    }
  }
};
</script>
