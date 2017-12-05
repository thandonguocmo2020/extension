<template>
<div class="main-extension">
  <div class="fluid">

      <!-- ACTIOn -->
      <div class="card">
            <div class="card-header bg-danger">
            Extension Get Link Follow  
        
                     <button v-if="auth == '2'" type="button" class="mr-10 float-right"  @click="logout" name="logout">Logout</button>
                
            </div>
            <div class="card-block">

            <div class="alert alert-warning" role="alert" v-if="alert">
              <strong>Warning!</strong> {{alert}}
            </div>
              <div class="row" v-if="auth != '2'">
                <div class="col-md-6">
                  <form v-on:submit.prevent="login($event)" class="form-inline">
                      
                      <div class="form-group mx-sm-3">
                        <label for="kwd" class="sr-only">Đăng Nhập</label>
                        <input type="email" class="form-control" name="uid" id="mail" placeholder="Mail">
                      </div>
                        <div class="form-group mx-sm-3">
                        <label for="kwd" class="sr-only">Password</label>
                        <input type="password" class="form-control" name="pwd" id="pass"  placeholder="Nhập mật khẩu">
                      </div>

                      <button type="submit" class="btn btn-primary btn-sm mr-10"  name="submit">Login</button>
                    </form>
                </div>
                <div class="col-md-6">
                    <div>{{ msgLogin }}</div>
                </div>
              </div>
        

              <div class="row" v-if="auth == '2'">
                <div class="col-md-5">

                  <div class="row">
                        <div class="form-group mx-sm-4">
                            <label for="kwd" class="sr-only">Keyword</label>
                            <input type="text" class="form-control form-control-sm"  v-model="kwd"  name="kwd" id="search" placeholder="Tu Khoa">
                          </div>
                          
                          <div class="form-group mx-sm-2">
                            <select class="custom-select mb-2 mr-sm-2 mb-sm-0 form-control-sm" id="type">
                              <option selected value="people">Theo loại...</option>
                              <option value="boards">boards</option>
                              <option value="people">people</option>
                              <option value="pins">pins</option>
                            </select>

                        </div>
                        <div class="form-group mx-sm-2">
                            <button type="button" class="btn btn-primary btn-sm mr-10"  @click="search" name="submit">Tìm Kiếm</button>
                        </div>
                  </div>

                </div>
        
                <div class="col-md-7"> 
                        <div class="row">
                          <div class="col-5">
                            <button type="button" class="btn btn-success btn-sm mr-10"  @click="scanner" name="scanner">Quét Link Này</button>
                            <button type="button" class="btn btn-warning btn-sm mr-10"  @click="stopScanner" name="stop-scanner">Dừng Quét</button>
                          </div>

                          <!-- <div class="col-4">
                             <input type="text" class="form-control form-control-sm"  @input="target" v-model="targetId" name="tid" id="tid"  placeholder="Target Id">
                          </div>  -->
                        <div>
                            <button  id="dowload" class="btn btn-info btn-sm mr-10 pull-right"  @click="dowloadFile" name="stop-scanner">Lưu Ra File</button>  
                           
                        </div>

                      </div>
                  </div>
                </div>
             </div>
            <!-- DATA -->
            <table class="table table-responsive" v-if="auth == '2'">  
                <!-- On rows -->
            
             <thead>
                <tr class="table-info">
                  <th>Kết Quả</th>  
                  <th>Lần tải</th> <!-- DOM LOAD -->
                  <th>Đã nạp</th>
                
                  <th>Trạng Thái</th>
                  <th>Thời gian quét </th>
                  <th>Số lần reload</th>
                </tr>
              </thead>
    
              <tr class="bg-warning">
                <td>{{result.length}} link</td>
                <td>{{ n }}</td>
                <td>{{links.length}}</td>
                <td>{{ status }}</td>
                <td>{{timeout}} ms</td>
                <td>{{count }}</td>
              </tr>
      
            </table>
        
      <!-- DATA -->
      </div>
      <!-- END ACTIOn -->

    
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
      auth: sessionStorage.getItem("auth"), // tạo tài khoản cho sử dụng extension
      uid: sessionStorage.getItem("uid"), // user id của tài khoản
      kwd: sessionStorage.getItem("kwd"), // tách list theo từ khóa nếu search
      targetId: sessionStorage.getItem("tid"), //  áp dụng cho kênh nào với list tương ứng
      // string
      msgLogin: "",
      links: [],
      continue: 0,
      stop: 2,
      count: 0,
      n: 0, // load Dom n lần
      timeout: 0,
      status: "Đang quét",
      result: [],
      alert: null
    };
  },

  methods: {
    login(e) {
      let _this = this;
      // app phai co https  
      $.post(
        "https://api-pint.tranhoanghiep.com/api/v1/login",
        $(e.target).serialize()
      ).done(function(data) {
        if (data.stt == 1) {
          _this.msgLogin = data.msg;
          sessionStorage.setItem("auth", 2);
          sessionStorage.setItem("uid", data.uid);
          location.reload();
        } else {
          _this.msgLogin = data.msg;
          sessionStorage.setItem("auth", 1);
          sessionStorage.setItem("uid", null);
        }
      });
    },
    logout() {
      sessionStorage.removeItem("auth");
      sessionStorage.removeItem("uid");
      sessionStorage.removeItem("scanner");
      location.reload();
    },
    search() {
      window.location = `https://www.pinterest.com/search/${$(
        "#type"
      ).val()}/?q=${$("#search").val()}`;
      sessionStorage.setItem("kwd", $("#search").val());
    },
    target() {
      let targetUrl = $("#tid").val();
      sessionStorage.setItem("tid", targetUrl);

      var jqxhr = $.post("https://localhost/api/v1/check/target", {
        _tid: targetUrl
      }).done(function(data) {
        if (data.stt == 1) {
          _this.alert = null;
        } else {
          _this.alert = "Target does not exist ! please update token. ";
        }
      });
    },
    scanner(start) {
      sessionStorage.setItem("scanner", 1);
      location.reload();
    },
    stopScanner() {
      sessionStorage.setItem("scanner", 0);
      this.stop = 1;
    },
    dowloadFile() {
      let data = this.result.join(",");
      let keyword = this.kwd || "pinterest user";
      var a = document.createElement("a");
      var file = new Blob([data], { type: "text/plain" });
      a.href = URL.createObjectURL(file);
      a.download = keyword + ".txt";
      a.click();
    }
    // sendLink(e) {

    // let _this = this;
    // let keyword = _this.kwd || "";
    // let userId = _this.uid;
    // let targetId = _this.targetId;

    // if (userId && targetId && this.result.length > 0) {
    //   // GET DATA So sánh match lookey
    //   // list link by user  and targetid

    //   var jqxhr = $.post("https://localhost/api/v1/link/follow", {
    //     _uid: userId
    //   })
    //     .done(function(data) {
    //       // list success
    //       if (data.stt == 1) {
    //         // list link foreach set keyloop HashMap

    //         let lnk = [];
    //         data.links.forEach(item => {
    //           lnk[item.lnk] = item.lnk;
    //         });

    //         let _payload = [];

    //         _this.result.forEach(item => {
    //           if (!lnk[item]) {
    //             _payload.push({
    //               keyword: keyword,
    //               _tid: targetId,
    //               _uid: sessionStorage.getItem("uid"),
    //               lnk: item
    //             });
    //           }
    //         });

    //         console.log(_payload);

    //         if (_payload.length > 0) {
    //           $.post("https://localhost/api/v1/link/follow/save", {
    //             links: _payload
    //           }).done(resutl => {
    //             console.log(resutl);
    //           });
    //         } else {
    //           console.log("the link has exists.");
    //         }
    //       } else {
    //         // new
    //         let _payload = [];

    //         _this.result.forEach(item => {
    //           _payload.push({
    //             keyword: keyword,
    //             _tid: targetId,
    //             _uid: userId,
    //             lnk: item
    //           });
    //         });
    //         // save

    //         console.log(_payload);

    //         $.post("https://localhost/api/v1/link/follow/save", {
    //           links: _payload
    //         }).done(resutl => {
    //           console.log(resutl);
    //         });
    //       }
    //     })
    //     .fail(function() {
    //       console.log(error);
    //     })
    //     .always(function() {
    //       console.log("finished");
    //     });
    // }
    // }
  },
  created() {
    let _this = this;

    //  start scanner if scanner == 1. using local store start or stop default
    if (sessionStorage.getItem("scanner") == 1 && _this.stop != 1) {
      // event listen paginate load data

      $("body").on("DOMNodeInserted", OnNodeInserted);
      // function handler
      function OnNodeInserted(event) {
        // default
        if (_this.stop != 1 && _this.stop != 0) {
          _this.n++;
          window.scrollTo(0, document.body.scrollHeight);

          $("a").each(function() {
            if (!_this.links.includes($(this).attr("href"))) {
              _this.links.push($(this).attr("href"));
            }
          });
        } else {
          // stop if pause

          if (_this.stop == 1) {
            _this.n++;

            _this.links.filter((item, index) => {
              if (index > 1) {
                if (item.split("/").length == 3) {
                  _this.result.push(item.replace(/\//g, ""));
                }
              }
            });
            _this.status = "Đã dừng quét";
            _this.stop = 0;
          }
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
              _this.status = "Dữ liệu được tải lại 3 lần";
              _this.count++;
            } else {
              _this.links.filter((item, index) => {
                if (index > 1) {
                  console.log(item.replace(/\//g, ""));
                  if (item.split("/").length == 3)
                    _this.result.push(item.replace(/\//g, ""));
                }
              });

              clearInterval(timer);
              _this.status = "Đã quét xong";
            }
          }
        } else {
          clearInterval(timer);
        }
        // END STOP
      }, 10000); // 10 giây để chờ nạp dữ liệu từ doom
    }
  }
};
</script>