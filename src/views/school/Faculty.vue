<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Fakülteler</strong>
            <b-button variant="success" @click="addModalShow = !addModalShow">
              Fakülte Ekle
            </b-button>
          </div>
          
          
          <b-modal v-model="addModalShow" @ok="addFaculty" size="lg"  title="Yeni Fakülte Ekle">
              <b-form-group
              label="Fakülte Adı"
              :label-cols="3"
              :horizontal="true">
              <b-form-input type="text" v-model="facultyName"></b-form-input>
            </b-form-group>
          </b-modal>

          <b-modal v-model="updateModalShow" @ok="updateFaculty" size="lg"  title="Fakülte Düzenle">
              <b-form-group
              label="Fakülte Adı"
              :label-cols="3"
              :horizontal="true">
              <b-form-input type="text" v-model="updateFacultyName"></b-form-input>
            </b-form-group>
          </b-modal>

          <b-table  striped hover :items="items" :fields="fields">
            <template slot="İşlem" slot-scope="data">
              <b-button variant="primary" @click="showUpdateModal(data.item)">
                Düzenle
              </b-button>

               <b-button variant="danger" @click="deleteFaculty(data.item.ID)">
                Sil
              </b-button>
            </template>
          </b-table> 


        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "Faculty",

  data() {
    return {
      addModalShow: false,
      facultyName: "",

      updateModalShow: false,
      updateFacultyName: "",
      updateFacultyId: null,

      fields: ["ID", "Fakülte Adı", "İşlem"],
      items: []
    };
  },

  created() {
    this.getFacultyList();
  },

  methods: {
    getFacultyList() {
      const url = "http://bitirme.emre.pw/Okul/Fakulteler";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));

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
            this.items = [];
            resJson.fakulteler.map(fac => {
              this.items.push({
                ID: fac.id,
                "Fakülte Adı": fac.adi
              });
            });
          }
        });
    },

    addFaculty() {
      if (!this.facultyName) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Okul/FakulteEkle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("adi", this.facultyName);

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
            this.getFacultyList();
          }
        });
    },

    showUpdateModal(item) {
      this.updateModalShow = !this.updateModalShow;
      this.updateFacultyName = item["Fakülte Adı"];
      this.updateFacultyId = item.ID;
    },

    updateFaculty() {
      const url = "http://bitirme.emre.pw/Okul/FakulteDuzenle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("id", this.updateFacultyId);
      data.append("adi", this.updateFacultyName);

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
            this.getFacultyList();
            this.updateFacultyName = "";
            this.updateFacultyId = null;
          }
        });
    },

    deleteFaculty(facultyId) {
      if (confirm("Silmek istediğinize emin misiniz?")) {
        const url = "http://bitirme.emre.pw/Okul/FakulteSil";

        var data = new FormData();
        data.append("token", sessionStorage.getItem("token"));
        data.append("id", facultyId);

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
              this.getFacultyList();
            }
          });
      }
    }
  }
};
</script>
