<template>
  <div class="properties">
    <nav class="navbar navbar-expand-sm navbar-light bg-info mb-3">
      <div class="container">
        <div class="float-left">
          <ul class="nav nav-pills">
            <li class="nav-item">
              <a
                href="/#/components"
                class="btn btn-light"
              >Components</a>
            </li>
            <li class="nav-item">
              <a
                href="/#/properties"
                class="btn btn-light active"
              >Properties</a>
            </li>
            <li class="nav-item">
              <a href="/#/modules" class="btn btn-light">Modules</a>
            </li>
            <li class="nav-item">
              <a href="/#/Templates" class="btn btn-light">Templates</a>
            </li>
            <li class="nav-item">
              <a href="/#/projects" class="btn btn-light">Projects</a>
            </li>
          </ul>
        </div>
        <div class="float-right" type="text">
          <div class="input-group mb-3">
            <input
              type="text"
              v-model="property_id"
              @keyup="searchProperties(property_id)"
              class="form-control"
              placeholder="Search"
              aria-label="Search"
              aria-describedby="basic-addon2"
            >
            <div class="input-group-append">
              <button class="btn input-group-text list-group-item-action" type="button">
                <i class="fa fa-search"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <button
      type="button"
      v-on:click=" addNew()"
      class="btn btn-primary float-right"
      data-toggle="modal"
      data-target="#myModal"
    >Add new</button>
    <modal name="create-property" :adaptive="true" height="auto" width="800" :scrollable="true">
      <form
        class="mb-3 forma"
        id="forma"
        @submit.prevent="createProperty"
        action="http://localhost:8081/properties"
        method="post"
      >
        <div class="line">
          <label for="name">Property Name</label>
          <input type="text" class="form-control" v-model="property.name" id="propName">
          <label for="type">Type</label>
          <input type="text" class="form-control" v-model="property.type" id="propType">
        </div>
        <div class="line"></div>
        <button type="submit" v-on:click="hide()" name="Save" class="btn btn-primary save">Save</button>
      </form>
    </modal>

    <modal name="show-property" :adaptive="true" height="auto" width="800" :scrollable="true">
      <table class="table property-table">
        <tbody>
          <tr>
            <td>Property Name</td>
            <td>{{this.property.name}}</td>
          </tr>
          <tr>
            <td>Type</td>
            <td>{{this.property.type}}</td>
          </tr>
        </tbody>
      </table>
    </modal>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Property Name</th>
          <th scope="col">Type</th>
          <th></th>
          <th></th>
        </tr>
      </thead>

      <tbody v-for="property in properties" v-bind:key="property.id">
        <tr class="click">
          <td @click="editProperty(property); showProperty();" scope="col">{{property.name}}</td>
          <td @click="editProperty(property); showProperty();" scope="col">{{property.type}}</td>

          <td scope="col">
            <button @click="editProperty(property); show();" class="btn btn-warning">Edit</button>
          </td>
          <td scope="col">
            <button @click="deleteProperty(property.id)" class="btn btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style>
button.btn.btn-primary.float-right {
  margin-right: 33px;
  margin-bottom: 10px;
}
.property-table {
  font-weight: 700;
  margin: 30px 30px 30px 30px;
}
.click:hover {
  background-color: rgb(239, 243, 249);
  cursor: pointer;
}
.forma {
  margin: 20px 100px;
}
label {
  font-weight: 700;
}
li.nav-item {
  margin-left: 15px;
}
.save {
  margin-top: 10px;
  text-align: center;
}
.form-control {
  width: 80%;
}
.line {
}
</style>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  name: "properties",
  components: {
    Multiselect
  },
  data() {
    return {
      properties: [],
      selected: [],
      property_id: "",
      property: {
        id: "",
        name: "",
        type: "",
        components: []
      },
      emptyProperty: {
        id: "",
        name: "",
        type: "",
        components: []
      },
      edit: false
    };
  },

  created() {
    this.fetchProperties();
  },
  methods: {
    addTag(newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor(Math.random() * 10000000)
      };
      this.options.push(tag);
      this.value.push(tag);
    },

    fetchProperties() {
      axios.get("http://localhost:8080/api/properties").then(response => {
        this.properties = response.data;
      });
    },
    searchProperties(property_id) {
      axios
        .get("http://localhost:8080/api/properties/search=" + property_id)
        .then(response => {
          this.properties = response.data;
        });
    },
    showProperty() {
      this.$modal.show("show-property", { property: this.property });
    },
    hideProperty() {
      this.$modal.hide("show-property");
    },

    show() {
      this.$modal.show("create-property");
    },

    hide() {
      this.edit = false;
      this.$modal.hide("create-property");
    },
    addNew() {
      this.property.id = "";
      this.property.name = "";
      this.property.type = "";
      this.edit = false;
      this.hide();
      this.show();
    },

    createProperty(property) {
      if (this.edit === false) {
        axios
          .post("http://localhost:8080/api/properties/", this.property)
          .then(data => {
            this.property = this.emptyProperty;
            this.fetchProperties();
          });
      } else {
        axios
          .put(
            "http://localhost:8080/api/properties/" + this.property.id,
            this.property
          )
          .then(data => {
            this.property = this.emptyProperty;
            this.fetchProperties();
          });
      }
    },
    editProperty(property) {
      this.edit = true;
      this.property.id = property.id;
      this.property.name = property.name;
      this.property.type = property.type;
    },
    deleteProperty(id) {
      if (confirm("Are you sure?")) {
        axios
          .delete("http://localhost:8080/api/properties/" + id, {
            data: { id: "id" }
          })
          .then(data => {
            this.fetchProperties();
          });
      }
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
