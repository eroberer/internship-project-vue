<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <div slot="header">
            <strong>Yeni Staj Ekle</strong>
          </div>

          <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>

          <b-form-group
            label="Bölüm"
            label-for="basicSelect"
            :label-cols="3"
            :horizontal="true">
            <b-form-select id="basicSelect"
              :plain="true"
              :options="userDepartment"
              v-model="selectedDepartment"
              value="Lütfen Seçiniz">
            </b-form-select>
          </b-form-group>

          <b-form-group
            label="Başlangıç Tarihi" label-for="date"
            :label-cols="3"
            :horizontal="true">
            <b-form-input type="date" id="beginDate" :min="minDate" v-model="beginDate"></b-form-input>
          </b-form-group>

          <b-form-group
            label="Bitiş Tarihi" label-for="date"
            :label-cols="3"
            :horizontal="true">
            <b-form-input type="date" id="endDate" :min="beginDate" v-model="endDate"></b-form-input>
          </b-form-group>

           <b-form-group label="Firma" 
            :label-cols="3"
            :horizontal="true">
            <b-form-radio-group id="radios2" v-model="selected" name="radioSubComponent">
              <b-form-radio value="select">Firma Seç</b-form-radio>
              <b-form-radio value="insert">Yeni Firma Ekle</b-form-radio>
            </b-form-radio-group>
          </b-form-group>

          <b-form-group
            v-if="selected == 'select'"
            label="Firma Seç"
            label-for="basicSelect"
            :label-cols="3"
            :horizontal="true">
            <b-form-select id="basicSelect"
              :plain="true"
              :options="select.companyList"
              v-model="select.selectId"
              value="Lütfen Seçiniz">
            </b-form-select>
          </b-form-group>

          <b-form-group
            v-if="selected == 'insert'"
            label="Firma Adı"
            label-for="basicSelect"
            :label-cols="3"
            :horizontal="true">
             <b-form-input type="text" v-model="insert.companyName"></b-form-input>
          </b-form-group>

          <b-form-group
            v-if="selected == 'insert'"
            label="Firma E-mail"
            label-for="basicSelect"
            :label-cols="3"
            :horizontal="true">
             <b-form-input type="text" v-model="insert.companyMail"></b-form-input>
          </b-form-group>

          <div slot="footer">
            <b-button type="button" size="sm" variant="primary" v-on:click="handleSubmit"><i class="fa fa-dot-circle-o"></i> Kaydet</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>

  </div>
</template>

<script>
export default {
  name: "InternAdd",

  data() {
    return {
      userDepartment: [],
      selectedDepartment: "",
      error: "",
      minDate: "",
      beginDate: "",
      endDate: "",
      selected: "select",
      select: {
        companyList: [],
        selectId: ""
      },
      insert: {
        companyName: "",
        companyMail: ""
      }
    };
  },

  created() {
    this.getMinDate();
    this.getCompanyList();
    this.getDepartment();
  },

  methods: {
    getDepartment() {
      var user = JSON.parse(sessionStorage.getItem("info"));
      user.bolumler.map(v => {
        this.userDepartment.push({
          value: v.bolum_id,
          text: v.bolum_adi + " - " + v.fakulte_adi
        });
      });
    },

    getMinDate() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }

      if (mm < 10) {
        mm = "0" + mm;
      }

      this.minDate = yyyy + "-" + mm + "-" + dd;
      this.beginDate = this.minDate;
    },

    getCompanyList() {
      const url = "http://bitirme.emre.pw/Firma/Listele";

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
            }
          } else {
            resJson.list.map(obj => {
              this.select.companyList.push({ value: obj.id, text: obj.adi });
            });
          }
        });
    },

    checkInputs() {
      var flag = true;
      console.log(this.selectedDepartment);

      if (!this.beginDate || !this.endDate || !this.selectedDepartment)
        flag = false;

      if (this.selected == "select") {
        if (isNaN(this.select.selectId)) flag = false;
      } else {
        if (!this.insert.companyName || !this.insert.companyMail) flag = false;
      }

      return flag;
    },

    addCompany() {
      const url = "http://bitirme.emre.pw/Firma/Ekle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("eposta", this.insert.companyMail);
      data.append("adi", this.insert.companyName);

      let fetchData = {
        method: "POST",
        body: data
      };

      return fetch(url, fetchData)
        .then(res => {
          return res.json();
        })
        .then(resJson => {
          if (resJson.result == false) {
            this.error = resJson.error;
            if (resJson.error == -1) {
              sessionStorage.clear();
              location.reload();
              return -1;
            }
          } else {
            return resJson.list.id;
          }
        });
    },

    addIntern(companyId) {
      const url = "http://bitirme.emre.pw/Staj/Ekle";

      var data = new FormData();
      data.append("token", sessionStorage.getItem("token"));
      data.append("kullanici_id", sessionStorage.getItem("userId"));
      data.append("baslangic_tarih", this.beginDate);
      data.append("bitis_tarih", this.endDate);
      data.append("bolum_id", this.selectedDepartment);
      data.append("firma_id", companyId);

      let fetchData = {
        method: "POST",
        body: data
      };

      return fetch(url, fetchData)
        .then(res => {
          return res.json();
        })
        .then(resJson => {
          if (resJson.result == false) {
            this.error = resJson.error;
            if (resJson.error == -1) {
              sessionStorage.clear();
              location.reload();
              return -1;
            }
          } else {
            alert("Staj başarıyla Eklendi!");
            this.$router.push({name: "InternList"});
          }
        });
    },

    handleSubmit() {
      if (this.checkInputs()) {
        this.error = "";
        if (this.selected == "select") {
          this.addIntern(this.select.selectId);
        } else {
          this.addCompany().then(companyId => {
            if (companyId != -1) {
              this.addIntern(companyId);
            }
          });
        }
      } else {
        this.error = "Lütfen boş alan bırakmayınız veya geçerli değer giriniz!";
      }
    }
  }
};
</script>
