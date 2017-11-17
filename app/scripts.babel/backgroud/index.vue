<template>
<div class="main-extension">
  <div class="fluid">

      <!-- ACTIOn -->
      <div class="card">
            <div class="card-header bg-danger">
            Extension Get Link Follow
            </div>
            <div class="card-block">
              <div class="row">
              <div class="col-md-6">

                   <form @submit.prevent class="form-inline">
                
                <div class="form-group mx-sm-3">
                  <label for="kwd" class="sr-only">Keyword</label>
                  <input type="text" class="form-control" name="kwd" id="search" placeholder="Tu Khoa">
                </div>
                  <div class="form-group mx-sm-3">

                  <select class="custom-select mb-2 mr-sm-2 mb-sm-0" id="type">
                  <option selected value="people">Theo loại...</option>
                  <option value="boards">boards</option>
                  <option value="people">people</option>
                  <option value="pins">pins</option>
                </select>

                </div>

                <button type="button" class="btn btn-primary btn-sm mr-10"  @click="search" name="submit">Tìm Kiếm</button>
            
              </form>
              </div>
      
              <div class="col-md-6"> 
                  <button type="button" class="btn btn-success btn-sm mr-10"  @click="scanner" name="scanner">Quét Link Này</button>
                  <button type="button" class="btn btn-warning btn-sm mr-10"  @click="stopScanner" name="stop-scanner">Dừng Quét</button>
               
                  <button type="button" class="btn btn-info btn-sm mr-10 pull-right"  @click="sendLink" name="stop-scanner">Lưu Dữ Liệu</button>
              
                </div>
              </div>
          </div>
      </div>
      <!-- END ACTIOn -->

      <!-- DATA -->
            <table class="table table-responsive">
                <!-- On rows -->
            
            <thead>
                <tr class="table-info">
                  
                  <th>Số lần tải DOM</th>
                  <th>Số link đã nạp</th>
                  <th>Số lần reset load</th>
                  <th>Trạng Thái</th>
                  <th>Thời gian quét </th>
                  <th>Kết Quả</th>
                </tr>
              </thead>
    
              <tr class="bg-warning">
                <td>{{ n }}</td>
                <td>{{links.length}}</td>
                <td>{{count }}</td>
                <td>{{ status }}</td>
                <td>{{timeout}} ms</td>
                <td>{{result.length}} link</td>
              </tr>
      
            </table>
      <!-- DATA -->
  </div>
</div>
</template>
<style>

</style>

<script>
import { setTimeout, setInterval, clearInterval } from "timers";
import $ from "jquery";
import moment from "moment";

export default {
  data() {
    return {
      links: [],
      continue: 0,
      stop: 0,
      count: 0,
      n: 0, // load Dom n lần
      timeout: 0,
      status: "Đang quét",
      result: []
    };
  },

  methods: {
    search() {
      window.location = `https://www.pinterest.com/search/${$(
        "#type"
      ).val()}/?q=${$("#search").val()}`;
    },
    scanner(start) {
      localStorage.setItem("scanner", 1);
      location.reload();
    },
    stopScanner() {
      localStorage.setItem("scanner", 0);
      this.stop = 1;
    },
    sendLink() {
      if (this.result.length > 0) {
        console.log("send data success");
      }
    }
  },
  created() {
    let _this = this;

    //  start scanner if scanner == 1. using local store start or stop default
    if (localStorage.getItem("scanner") == 1 && _this.stop != 1) {
      // event listen paginate load data
      document.body.addEventListener("DOMNodeInserted", OnNodeInserted, true);

      // function handler
      function OnNodeInserted(event) {
        _this.n++;
        // default
        if (_this.stop != 1) {
          window.scrollTo(0, document.body.scrollHeight);

          $("a").each(function() {
            if (!_this.links.includes($(this).attr("href"))) {
              _this.links.push($(this).attr("href"));
            }
          });
        } else {
          // stop if pause
          _this.result = _this.links.filter((item, index) => {
            if (index > 1) {
              if (item.split("/").length == 3) return item;
            }
          });

          _this.status = "Đã dừng quét";
        }
      }

      // CHECK STOP Default If No Pause Stop
      var timer = setInterval(function() {
        _this.timeout += 10000;

        if (_this.stop != 1) {
          // continue
          if (_this.links.length > 0 && _this.links.length > _this.continue) {
            _this.continue = _this.links.length;
          } else {
            // x3 time stop
            if (_this.count < 3) {
              _this.status = "Dữ liệu được kiểm tra lại 3 lần";
              _this.count++;
            } else {
              _this.result = _this.links.filter((item, index) => {
                if (index > 1) {
                  if (item.split("/").length == 3) return item;
                }
              });

              clearInterval(timer);
              _this.status = "Đã quét xong";
              console.log(_this.result);
            }
          }
        } else {
          _this.result = _this.links.filter((item, index) => {
            if (index > 1) {
              if (item.split("/").length == 3) return item;
            }
          });

          clearInterval(timer);
          _this.status = "Đã tạm dừng";
          console.log(_this.result);
        }
        // END STOP
      }, 10000);
    }
  }
};
</script>