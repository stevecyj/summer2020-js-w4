export default {
  template: `<div class="modal-dialog modal-xl" role="document">
  <div class="modal-content border-0">
    <div class="modal-header bg-dark text-white">
      <h5 id="exampleModalLabel" class="modal-title">
        <span>新增產品</span>
      </h5>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="row">
        <div class="col-sm-4">
          <div class="form-group">
            <label for="imageUrl">輸入圖片網址</label>
            <input id="imageUrl" v-model="tempProduct.imageUrl[0]" type="text" class="form-control"
              placeholder="請輸入圖片連結">
          </div>
          <div class="form-group">
            <label for="customFile">
              或 上傳圖片
              <i class="fas fa-spinner fa-spin"></i>
            </label>
            <input id="customFile" type="file" class="form-control" @change="uploadFile">
          </div>
          <img class="img-fluid" :src="tempProduct.imageUrl[0]" alt />
        </div>
        <div class="col-sm-8">
          <div class="form-group">
            <label for="title">標題</label>
            <input id="title" v-model="tempProduct.title" type="text" class="form-control" placeholder="請輸入標題">
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="category">分類</label>
              <input id="category" v-model="tempProduct.category" type="text" class="form-control"
                placeholder="請輸入分類" >
            </div>
            <div class="form-group col-md-6">
              <label for="price">單位</label>
              <input id="unit" v-model="tempProduct.unit" type="unit" class="form-control"
                placeholder="請輸入單位">
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="origin_price">原價</label>
              <input id="origin_price" v-model="tempProduct.origin_price" type="number" class="form-control"
                placeholder="請輸入原價">
            </div>
            <div class="form-group col-md-6">
              <label for="price">售價</label>
              <input id="price" v-model="tempProduct.price" type="number" class="form-control"
                placeholder="請輸入售價">
            </div>
          </div>
          <hr>
          <div class="form-group">
            <label for="description">產品描述</label>
            <textarea id="description" v-model="tempProduct.description" type="text" class="form-control"
              placeholder="請輸入產品描述" >
            </textarea>
          </div>
          <div class="form-group">
            <label for="content">說明內容</label>
            <textarea id="description" v-model="tempProduct.content" type="text" class="form-control"
              placeholder="請輸入說明內容" >
            </textarea>
          </div>
          <div class="form-group">
            <div class="form-check">
              <input id="is_enabled" v-model="tempProduct.enabled" class="form-check-input" type="checkbox">
              <label class="form-check-label" for="is_enabled">是否啟用</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">
        取消
      </button>
      <button type="button" class="btn btn-primary" @click="updateProduct()">
        確認
      </button>
    </div>
  </div>
</div>
  `,
  data() {
    return {
      // tempProduct:{}
    };
  },
  props: ["tempProduct", "api", "isNew"],
  methods: {
    updateProduct() {
      // 新增商品
      let api = `https://course-ec-api.hexschool.io/api/${this.api.uuid}/admin/ec/product`;
      let httpMethod = "post";
      // 當不是新增商品時則切換成編輯商品 API
      if (!this.isNew) {
        api = `https://course-ec-api.hexschool.io/api/${this.api.uuid}/admin/ec/product/${this.tempProduct.id}`;
        httpMethod = "patch";
      }

      axios[httpMethod](api, this.tempProduct)
        .then(() => {
          $("#productModal").modal("hide");
          this.$emit("update");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    uploadFile() {
      const url = `${this.api.path}${this.api.uuid}/admin/storage`;
      // 選取 DOM 中的檔案資訊
      const uploadedfile = document.querySelector("#customFile").files[0];
      console.dir(uploadedfile);
      // 轉成 Form Data
      const formData = new FormData();
      formData.append("file", uploadedfile);

      axios
        .post(url, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          const imgPath = res.data.data.path;
          if (this.tempProduct.id) {
            this.tempProduct.imageUrl[0] = imgPath;
          } else if (!this.tempProduct.id) {
            this.tempProduct.imageUrl.push(imgPath);
          }
        });
    },
  },
};
