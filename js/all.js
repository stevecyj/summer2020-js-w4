import pagination from "../js/pagination.js";
import modal from "../js/modal.js";
import deleteModal from "../js/deleteModal.js";
Vue.component("pagination", pagination);
Vue.component("modal", modal);
Vue.component("deleteModal", deleteModal);

Vue.filter("money", function (num) {
  var parts = num.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return "$" + parts.join(".");
});

new Vue({
  el: "#app",
  data: {
    products: [],
    pagination: {},
    tempProduct: {
      imageUrl: [],
    },
    api: {
      uuid: "5bffb293-5936-4139-961e-e2006317c701",
      path: "https://course-ec-api.hexschool.io/api/",
    },
    token: "",
    filePath: "",
    isNew: false,
    loadingBtn: "",
  },
  methods: {
    openModal(isNew, item) {
      if (isNew == "new") {
        this.tempProduct = { imageUrl: [] };
        this.isNew = true;
        $("#productModal").modal("show");
      } else if (isNew == "edit") {
        this.loadingBtn = item.id;
        const url = `${this.api.path}${this.api.uuid}/admin/ec/product/${item.id}`;
        axios.get(url).then((res) => {
          this.tempProduct = res.data.data;
          this.isNew = false;
          $("#productModal").modal("show");
          this.loadingBtn = ""; //清除
        });
        // this.tempProduct = Object.assign({}, item);
      } else if (isNew == "delete") {
        $("#delProductModal").modal("show");
        this.tempProduct = Object.assign({}, item);
      }
    },
    getProducts(num) {
      if (!num) {
        num = 1;
      }
      const url = `${this.api.path}${this.api.uuid}/admin/ec/products?page=${num}`;
      axios.get(url).then((res) => {
        console.log(res);
        this.products = res.data.data;
        this.pagination = res.data.meta.pagination;
        if (this.tempProduct.id) {
          this.tempProduct = {
            imageUrl: [],
          };
          $("#productModal").modal("hide");
        }
      });
    },
  },
  created() {
    this.token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
    this.getProducts();
  },
});
