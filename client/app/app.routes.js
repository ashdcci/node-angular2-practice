"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var tasks_component_1 = require("./components/tasks/tasks.component");
var posts_component_1 = require("./components/posts/posts.component");
var file_component_1 = require("./components/upload/file.component");
var appRoutes = [
    { path: '', component: tasks_component_1.TasksComponent },
    { path: 'tasks', component: tasks_component_1.TasksComponent },
    { path: 'posts', component: posts_component_1.PostsComponent },
    { path: 'upload', component: file_component_1.SimpleDemoComponent }
];
exports.routing = router_1.RouterModule.forRoot(appRoutes, { useHash: true });
//# sourceMappingURL=app.routes.js.map