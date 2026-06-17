import{f as d}from"./index-bY594eL_.js";const p={list:t=>d.get("/admin/products",{params:t}).then(a=>a.data),show:t=>d.get(`/admin/products/${t}`).then(a=>a.data.data)};export{p};
