import{f as d}from"./index-CkPhsh_I.js";const p={list:t=>d.get("/admin/products",{params:t}).then(a=>a.data),show:t=>d.get(`/admin/products/${t}`).then(a=>a.data.data)};export{p};
