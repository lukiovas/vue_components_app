<template>
  <div class="components">
    <nav class="navbar navbar-expand-sm navbar-light bg-info mb-3">
      <div class="container">
        <div class="float-left">
          <ul class="nav nav-pills" id="nav-list">
            <li class="nav-item">
              <a
                href="/#/components"
                class="btn btn-light active"
              >Components</a>
            </li>
            <li class="nav-item">
              <a
                href="/#/properties"
                class="btn btn-light"
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
              v-model="component_id"
              @keyup="searchComponents(component_id)"
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
    <modal name="create-component" :adaptive="true" height="800" width="800" :scrollable="true">
      <form
        class="mb-3 forma"
        id="forma"
        @submit.prevent="createComponent"
        action="http://localhost:8081/components"
        method="post"
      >
        <div class="line">
          <label for="name">Component Name</label>
          <input type="text" class="form-control" v-model="component.name" id="compName">
        </div>
        <div class="line">
          <label class="typo__label">Properties</label>
          <multiselect
            v-model="component.properties"
            tag-placeholder="Add this as new property"
            id="devices"
            placeholder="Search or add a property"
            label="name"
            :allow-empty="true"
            track-by="id"
            :options="this.properties"
            :max-height="500"
            :multiple="true"
            :taggable="true"
            @tag="addTag"
          ></multiselect>
          <pre class="language-json"><code></code></pre>
        </div>
        <div class="line"></div>
        <button type="submit" v-on:click="hide()" name="Save" class="btn btn-primary save">Save</button>
      </form>
    </modal>

    <modal name="show-component" :adaptive="true" height="auto" width="800" :scrollable="true">
      <table class="table component-table">
        <tbody>
          <tr>
            <td>Component Name</td>
            <td>{{this.component.name}}</td>
          </tr>
          <tr>
            <td>Properties</td>
            <td>
              <ul class="list-group">
                <li
                  class="list-group-item item"
                  v-for="property in this.component.properties"
                  v-bind:key="property.id"
                >
                  <b>{{property.type}}</b>
                  {{" " + property.name}}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </modal>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Component Name</th>
          <th scope="col">Properties</th>
          <th></th>
          <th></th>
        </tr>
      </thead>

      <tbody v-for="component in components" v-bind:key="component.id">
        <tr class="click">
          <td @click="editComponent(component); showComponent();" scope="col">{{component.name}}</td>
          <td @click="editComponent(component); showComponent();" scope="col">
            <ul class="list-group">
              <li
                class="list-group-item item"
                v-for="property in component.properties"
                v-bind:key="property.id"
              >
                <b>{{property.type}}</b>
                {{" " + property.name}}
              </li>
            </ul>
          </td>
          <td scope="col">
            <button @click="editComponent(component); show();" class="btn btn-warning">Edit</button>
          </td>
          <td scope="col">
            <button @click="deleteComponent(component.id)" class="btn btn-danger">Delete</button>
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
.component-table {
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
.save {
  margin-top: 10px;
  text-align: center;
}
.form-control {
  width: 80%;
}

li.list-group-item.item {
  background-color: rgba(65, 221, 34, 0.3);
  margin-right: 50px;
}
.btn-light:hover,
.btn-light:active {
  background-color: yellow;
}
</style>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  name: "components",
  components: {
    Multiselect
  },
  data() {
    return {
      components: [],
      properties: [],

      component: {
        id: "",
        name: "",
        properties: []
      },
      emptyComponent: {
        id: "",
        name: "",
        properties: []
      },
      selected: [],
      component_id: "",
      property: {
        id: "",
        name: "",
        type: ""
      },
      emptyProperty: {
        id: "",
        name: "",
        type: ""
      },
      edit: false
    };
  },

  created() {
    this.fetchComponents();
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

    fetchComponents() {
      axios.get("http://localhost:8080/api/components").then(response => {
        this.components = response.data;
      });
    },
    fetchProperties() {
      axios.get("http://localhost:8080/api/properties").then(response => {
        this.properties = response.data;
      });
    },
    searchComponents(component_id) {
      axios
        .get("http://localhost:8080/api/components/search=" + component_id)
        .then(response => {
          this.components = response.data;
        });
    },
    showComponent() {
      this.$modal.show("show-component", { component: this.component });
    },
    hideComponent() {
      this.$modal.hide("show-component");
    },

    show() {
      this.$modal.show("create-component");
    },

    hide() {
      this.edit = false;
      this.$modal.hide("create-component");
    },
    addNew() {
      this.component.name = "";
      this.component.properties = [];
      this.edit = false;
      this.hide();
      this.show();
    },

    createComponent(component) {
      if (this.edit === false) {
        axios
          .post("http://localhost:8080/api/components/", this.component)
          .then(data => {
            this.component = this.emptyComponent;
            this.fetchComponents();
          });
      } else {
        axios
          .put(
            "http://localhost:8080/api/components/" + this.component.id,
            this.component
          )
          .then(data => {
            this.component = this.emptyComponent;
            this.fetchComponents();
          });
      }
    },
    editComponent(component) {
      this.edit = true;
      this.component.id = component.id;
      this.component.name = component.name;
      this.component.properties = component.properties;
    },
    deleteComponent(id) {
      if (confirm("Are you sure?")) {
        axios
          .delete("http://localhost:8080/api/components/" + id, {
            data: { id: "id" }
          })
          .then(data => {
            this.fetchComponents();
          });
      }
    }

    // generateComponent(component) {
    //             axios({method: 'POST',
    //         url: 'http://localhost:8080/api/components/'+this.component.id+'/'+this.component.name,
    //         data: JSON.stringify(this.component),
    //         headers:{'Content-Type': 'application/json; charset=utf-8'}}).then((response) => {
    //         this.generated = response.data}).then(data => {
    //                     this.component=this.emptyComponent; })
    // }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
