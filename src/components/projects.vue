<template>
  <div class="projects">
    <nav class="navbar navbar-expand-sm navbar-light bg-info mb-3">
      <div class="container">
        <div class="float-left">
          <ul class="nav nav-pills">
            <li class="nav-item">
              <a
                href="/components"
                class="btn btn-light"
              >Components</a>
            </li>
            <li class="nav-item">
              <a
                href="/properties"
                class="btn btn-light"
              >Properties</a>
            </li>
            <li class="nav-item">
              <a href="/Modules" class="btn btn-light">Modules</a>
            </li>
            <li class="nav-item">
              <a href="/Templates" class="btn btn-light">Templates</a>
            </li>
            <li class="nav-item">
              <a
                href="/projects"
                class="btn btn-light active"
              >Projects</a>
            </li>
          </ul>
        </div>
        <!-- <div class="float-right" type="text">
                <div class="input-group mb-3">
  <input type="text" v-model="module_id" @keyup="searchModules(module_id)" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="basic-addon2">
  <div class="input-group-append">
    <button class="btn input-group-text list-group-item-action" type="button"><i class="fa fa-search"></i></button>
  </div>
</div>
        </div>-->
      </div>
    </nav>

    <button
      type="button"
      v-on:click=" addNew()"
      class="btn btn-primary float-right"
      data-toggle="modal"
      data-target="#myModal"
    >Add new</button>
    <modal name="create-project" :adaptive="true" height="800" width="800" :scrollable="true">
      <form
        class="mb-3 forma"
        id="forma"
        @submit.prevent="createProject"
        action="http://localhost:8081/projects"
        method="post"
      >
        <div class="line">
          <label for="name">Project Name</label>
          <input type="text" class="form-control" v-model="project.name" id="PrjctName">
          <label for="modules" class="typo__label">Modules</label>
          <multiselect
            v-model="project.modules"
            tag-placeholder="Add this as new module"
            id="modules"
            placeholder="Search or add a module"
            label="name"
            :allow-empty="true"
            track-by="id"
            :options="this.modules"
            :max-height="500"
            :multiple="true"
            :taggable="true"
          ></multiselect>
          <pre class="language-json"><code></code></pre>
        </div>

        <button type="submit" v-on:click="hide()" name="Save" class="btn btn-primary save">Save</button>
      </form>
    </modal>

    <modal name="show-project" :adaptive="true" height="auto" width="800" :scrollable="true">
      <table class="table project-table">
        <tbody>
          <tr>
            <td>Project Name</td>
            <td>{{this.project.name}}</td>
          </tr>
          <tr>
            <td>Modules</td>
            <td>
              <ul v-if="this.project.modules!==[]" class="list-group">
                <li
                  class="list-group-item item"
                  v-for="module in this.project.modules"
                  v-bind:key="module.id"
                >{{module.name}}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </modal>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Project Name</th>
          <th scope="col">modules</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
      </thead>

      <tbody v-for="project in projects" v-bind:key="project.id">
        <tr class="click">
          <td @click="editProject(project); showProject();" scope="col">{{project.name}}</td>
          <td @click="editProject(project); showProject();" scope="col">
            <ul v-if="project.modules!==[]" class="list-group">
              <li
                class="list-group-item item"
                v-for="module in project.modules"
                v-bind:key="module.id"
              >
                <b>{{module.name}}</b>
              </li>
            </ul>
          </td>

          <td scope="col">
            <button
              @click="editProject(project); generateProject(project)"
              class="btn btn-success"
            >Generate</button>
          </td>
          <td scope="col">
            <button @click="editProject(project); show();" class="btn btn-warning">Edit</button>
          </td>
          <td scope="col">
            <button @click="deleteProject(project.id)" class="btn btn-danger">Delete</button>
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
.project-table {
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
</style>

<script>
import axios from "axios";
import Multiselect from "vue-multiselect";

export default {
  name: "project",
  components: {
    Multiselect
  },
  data() {
    return {
      projects: [],
      modules: [],
      selected: [],
      project_id: "",
      project: {
        id: "",
        name: "",
        modules: []
      },
      emptyProject: {
        id: "",
        name: "",
        modules: []
      },
      module: {
        id: "",
        name: "",
        templates: [],
        component: {
          id: "",
          name: "",
          properties: []
        }
      },
      emptyModule: {
        id: "",
        name: "",
        templates: [],
        component: {
          id: "",
          name: "",
          properties: []
        }
      },
      edit: false
    };
  },

  created() {
    this.fetchProjects();
    this.fetchModules();
  },
  methods: {
    fetchModules() {
      axios.get("http://localhost:8080/api/Modules").then(response => {
        this.modules = response.data;
      });
    },
    fetchProjects() {
      axios.get("http://localhost:8080/api/projects").then(response => {
        this.projects = response.data;
      });
    },
    showProject() {
      this.$modal.show("show-project", { project: this.project });
    },
    hideProject() {
      this.$modal.hide("show-project");
    },

    show() {
      this.$modal.show("create-project");
    },

    hide() {
      this.edit = false;
      this.$modal.hide("create-project");
    },
    addNew() {
      this.project.id = "";
      this.project.name = "";
      this.project.modules = [];
      this.edit = false;
      this.hide();
      this.show();
    },

    createProject(project) {
      if (this.edit === false) {
        axios
          .post("http://localhost:8080/api/projects", this.project)
          .then(data => {
            this.project = this.emptyProject;
            this.fetchProjects();
          });
      } else {
        axios
          .put(
            "http://localhost:8080/api/projects/" + this.project.id,
            this.project
          )
          .then(data => {
            this.project = this.emptyProject;
            this.fetchProjects();
          });
      }
    },
    editProject(project) {
      this.edit = true;
      this.project.id = project.id;
      this.project.name = project.name;
      this.project.modules = project.modules;
    },
    deleteProject(id) {
      if (confirm("Are you sure?")) {
        axios
          .delete("http://localhost:8080/api/projects/" + id, {
            data: { id: "id" }
          })
          .then(data => {
            this.fetchProjects();
          });
      }
    },
    generateProject(project) {
      axios
        .post("http://localhost:8080/api/projects/" + project.id, this.project)
        .then(data => {
          this.fetchProjects();
        });
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
