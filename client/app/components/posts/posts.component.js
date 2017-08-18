"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var post_service_1 = require("../../services/post.service");
var PostsComponent = (function () {
    function PostsComponent(postService) {
        var _this = this;
        this.postService = postService;
        this.postService.getPosts()
            .subscribe(function (posts) {
            _this.post = posts;
        });
    }
    PostsComponent.prototype.deletePost = function (id) {
        console.log(id);
    };
    PostsComponent.prototype.likePost = function (id, check) {
        this.postService.likePost(id)
            .subscribe(function (data) {
            console.log(data);
            if (data.n == 1) {
            }
        });
    };
    return PostsComponent;
}());
PostsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'posts',
        templateUrl: 'posts.component.html'
    }),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostsComponent);
exports.PostsComponent = PostsComponent;
//# sourceMappingURL=posts.component.js.map