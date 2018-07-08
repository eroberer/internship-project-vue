<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Öğrenciler</strong>
            <b-button variant="success" @click="addModalShow = !addModalShow">
              Öğrenci Ekle
            </b-button>
          </div>
          
          
          <b-modal v-model="addModalShow" @ok="addStudent" size="lg"  title="Yeni Öğrenci Ekle">

              <b-form-group
              label="Bölüm"
              label-for="basicSelect"
              :label-cols="3"
              :horizontal="true">
              <b-form-select id="basicSelect"
                :plain="true"
                :options="departments"
                v-model="selectedDepartment"
                value="Lütfen Seçiniz">
              </b-form-select>
              </b-form-group>

              <b-form-group
              label="Ad Soyad"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="fullname"></b-form-input>
              </b-form-group>

              <b-form-group
              label="Öğrenci No"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="studentNumber"></b-form-input>
              </b-form-group>

              <b-form-group
              label="Tc No"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="tcNumber"></b-form-input>
              </b-form-group>

              <b-form-group
              label="Eposta"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="email"></b-form-input>
              </b-form-group>

              <b-form-group
              label="Telefon"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="phone"></b-form-input>
              </b-form-group>

          </b-modal>

          <b-modal v-model="updateModalShow" @ok="updateStudent" size="lg"  title="Bölüm Düzenle">
              
              <b-form-group
              label="Bölüm"
              label-for="basicSelect"
              :label-cols="3"
              :horizontal="true">
              <b-form-select id="basicSelect"
                :plain="true"
                :options="departments"
                v-model="updateSelectedDepartment"
                value="Lütfen Seçiniz">
              </b-form-select>
              </b-form-group>

              <b-form-group
              label="Ad Soyad"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="updateFullname"></b-form-input>
              </b-form-group>

              <b-form-group
              label="Öğrenci No"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="updateStudentNumber"></b-form-input>
              </b-form-group>

              <b-form-group
              label="Tc No"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="updateTcNumber"></b-form-input>
              </b-form-group>

              <b-form-group
              label="Eposta"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="updateEmail"></b-form-input>
              </b-form-group>

              <b-form-group
              label="Telefon"
              :label-cols="3"
              :horizontal="true">
                <b-form-input type="text" v-model="updatePhone"></b-form-input>
              </b-form-group>

          </b-modal>

          <b-table  striped hover :items="items" :fields="fields">
            <template slot="İşlem" slot-scope="data">
              <b-button variant="primary" @click="showUpdateModal(data.item)">
                Düzenle
              </b-button>

               <b-button variant="danger" @click="deleteStudent(data.item.userId)">
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
  name: "Student",

  data() {
    return {
      addModalShow: false,
      fullname: "",
      studentNumber: "",
      tcNumber: "",
      email: "",
      selectedDepartment: "",
      phone: "",

      updateStudentId: null,
      updateModalShow: false,
      updateFullname: "",
      updateStudentNumber: "",
      updateTcNumber: "",
      updateEmail: "",
      updateSelectedDepartment: "",
      updatePhone: "",
      updatePassword: "",

      departments: [],
      fields: ["Numara", "Ad Soyad", "Eposta", "Şifre", "Telefon", "İşlem"],
      items: []
    };
  },

  created() {
    this.getDepartmentList();
    this.getStudentList();
  },

  methods: {
    getStudentList() {
      const url = "http://bitirme.emre.pw/Okul/Kullanicilar";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("rutbe", 1);

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
            resJson.kullanicilar.map(s => {
              this.items.push({
                id: s.id,
                Numara: s.ogrenci_no,
                "Ad Soyad": s.ad_soyad,
                Eposta: s.eposta,
                Şifre: s.sifre,
                Telefon:
                  s.telefonlar.length == 0 ? "" : s.telefonlar[0].telefon,
                Telefonlar: s.telefonlar,
                tcNumber: s.tc_no,
                userId: s.kullanici_id,
                password: s.sifre
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
            resJson.fakulteler.map(f => {
              f.bolumler.map(dep => {
                this.departments.push({
                  value: dep.id,
                  text: dep.adi
                });
              });
            });
          }
        });
    },

    addStudent() {
      if (
        !this.fullname ||
        !this.studentNumber ||
        !this.tcNumber ||
        !this.email ||
        !this.selectedDepartment ||
        !this.phone
      ) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Okul/OgrenciEkle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("ad_soyad", this.fullname);
      data.append("ogrenci_no", this.studentNumber);
      data.append("tc_no", this.tcNumber);
      data.append("eposta", this.email);
      data.append("bolum_id", "[" + this.selectedDepartment + "]");
      data.append("telefon", '{"gsm":"' + this.phone + '"}');

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
            this.getStudentList();
            this.fullname = "";
            this.studentNumber = "";
            this.tcNumber = "";
            this.email = "";
            this.selectedDepartment = "";
            this.phone = "";
          }
        });
    },

    showUpdateModal(item) {
      this.updateModalShow = !this.updateModalShow;
      this.updateStudentId = item.userId;
      this.updateFullname = item["Ad Soyad"];
      this.updateStudentNumber = item["Numara"];
      this.updateTcNumber = item.tcNumber;
      this.updateEmail = item.Eposta;
      this.updatePhone = item.Telefon;
      this.updatePassword = item.password;
    },

    updateStudent() {
      if (
        !this.updateFullname ||
        !this.updateStudentNumber ||
        !this.updateTcNumber ||
        !this.updateEmail ||
        !this.updateSelectedDepartment ||
        !this.updatePhone
      ) {
        alert("Boş alan bırakmayınız!");
        return;
      }

      const url = "http://bitirme.emre.pw/Okul/OgrenciDuzenle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("id", this.updateStudentId);
      data.append("ad_soyad", this.updateFullname);
      data.append("ogrenci_no", this.updateStudentNumber);
      data.append("tc_no", this.updateTcNumber);
      data.append("eposta", this.updateEmail);
      data.append("sifre", this.updatePassword);
      data.append("bolum_id", "[" + this.updateSelectedDepartment + "]");
      data.append("telefon", '{"gsm":"' + this.updatePhone + '"}');

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
            this.getStudentList();
            this.updateStudentId = null;
            this.updateFullname = "";
            this.updateStudentNumber = "";
            this.updateTcNumber = "";
            this.updateSelectedDepartment = null;
            this.updateEmail = "";
            this.updatePhone = "";
          }
        });
    },

    deleteStudent(studentId) {
      if (confirm("Silmek istediğinize emin misiniz?")) {
        const url = "http://bitirme.emre.pw/Okul/OgrenciSil";

        var data = new FormData();
        data.append("token", sessionStorage.getItem("token"));
        data.append("id", studentId);

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
              this.getStudentList();
            }
          });
      }
    }
  }
};
</script>
