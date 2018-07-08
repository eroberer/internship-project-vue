<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Bölümler</strong>
            <b-button variant="success" @click="addModalShow = !addModalShow">
              Bölüm Ekle
            </b-button>
          </div>
          
          
          <b-modal v-model="addModalShow" @ok="addDepartment" size="lg"  title="Yeni Bölüm Ekle">

              <b-form-group
              label="Fakülte"
              label-for="basicSelect"
              :label-cols="3"
              :horizontal="true">
              <b-form-select id="basicSelect"
                :plain="true"
                :options="faculties"
                v-model="selectedFaculty"
                value="Lütfen Seçiniz">
              </b-form-select>
              </b-form-group>

              <b-form-group
              label="Bölüm Adı"
              :label-cols="3"
              :horizontal="true">
              <b-form-input type="text" v-model="departmentName"></b-form-input>
            </b-form-group>
          </b-modal>

          <b-modal v-model="updateModalShow" @ok="updateDepartment" size="lg"  title="Bölüm Düzenle">

              <b-form-group
              label="Fakülte"
              label-for="basicSelect"
              :label-cols="3"
              :horizontal="true">
              <b-form-select id="basicSelect"
                :plain="true"
                :options="faculties"
                v-model="updateSelectedFaculty"
                value="Lütfen Seçiniz">
              </b-form-select>
              </b-form-group>             

              <b-form-group
              label="Bölüm Adı"
              :label-cols="3"
              :horizontal="true">
              <b-form-input type="text" v-model="updateDepartmentName"></b-form-input>
            </b-form-group>
          </b-modal>

          <b-table  striped hover :items="items" :fields="fields">
            <template slot="İşlem" slot-scope="data">
              <b-button variant="primary" @click="showUpdateModal(data.item)">
                Düzenle
              </b-button>

               <b-button variant="danger" @click="deleteDepartment(data.item.ID)">
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
  name: "Department",

  data() {
    return {
      addModalShow: false,
      departmentName: "",
      facultyId: null,
      selectedFaculty: null,

      updateSelectedFaculty: null,
      updateModalShow: false,
      updateDepartmentName: "",
      updateDepartmentFacultyId: "",
      updateDepartmentId: null,

      faculties: [],
      fields: ["ID", "Bölüm Adı", "Fakülte Adı", "İşlem"],
      items: []
    };
  },

  created() {
    this.getDepartmentList();
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
            resJson.fakulteler.map(fac => {
              this.faculties.push({
                value: fac.id,
                text: fac.adi
              });
            });
          }
        });
    },

    getDepartmentList() {
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
            resJson.fakulteler.map(f => {
              f.bolumler.map(dep => {
                this.items.push({
                  ID: dep.id,
                  "Bölüm Adı": dep.adi,
                  "Fakülte Adı": f.adi,
                  facultyId: f.id
                });
              });
            });
          }
        });
    },

    addDepartment() {
      if (!this.departmentName || !this.selectedFaculty) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Okul/BolumEkle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("adi", this.departmentName);
      data.append("fakulte_id", this.selectedFaculty);

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
            this.getDepartmentList();
          }
        });
    },

    showUpdateModal(item) {
      this.updateModalShow = !this.updateModalShow;
      this.updateDepartmentName = item["Bölüm Adı"];
      this.updateDepartmentId = item.ID;
      this.updateDepartmentFacultyId = item.facultyId;
    },

    updateDepartment() {
      if (!this.updateDepartmentName || !this.updateDepartmentFacultyId) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Okul/BolumDuzenle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("id", this.updateDepartmentId);
      data.append("adi", this.updateDepartmentName);
      data.append("fakulte_id", this.updateDepartmentFacultyId);

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
            this.getDepartmentList();
            this.updateDepartmentName = "";
            this.updateDepartmentId = null;
            this.updateDepartmentFacultyId = "";
          }
        });
    },

    deleteDepartment(departmentId) {
      if (confirm("Silmek istediğinize emin misiniz?")) {
        const url = "http://bitirme.emre.pw/Okul/BolumSil";

        var data = new FormData();
        data.append("token", sessionStorage.getItem("token"));
        data.append("id", departmentId);

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
              this.getDepartmentList();
            }
          });
      }
    }
  }
};
</script>
