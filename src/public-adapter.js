/* Public-site data adapter.
   Gives src/paper.html the same window.claude.use('db') interface it uses inside Claude,
   but reads shared content from data/site.json and keeps each visitor's own progress
   (done, saved, follows, streak, lab values, terms) in their browser only. */
(function(){
  document.documentElement.classList.add('public');
  var KEY='mr-public-v1', L={};
  try{L=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){L={}}
  L.p=L.p||{};L.s=L.s||{};L.d=L.d||{};
  function save(){try{localStorage.setItem(KEY,JSON.stringify(L))}catch(e){}}
  var BASE=null, subs=[];
  function isObj(v){return v&&typeof v==='object'&&!Array.isArray(v)}
  function merge(a,b){var o={},k;for(k in a)o[k]=a[k];for(k in b)o[k]=isObj(b[k])&&isObj(a[k])?merge(a[k],b[k]):b[k];return o}
  function baseCol(c){return (BASE&&BASE.collections&&BASE.collections[c])||{}}
  function docOf(path){
    if(L.d[path])return null;
    var i=path.indexOf('/'),c=path.slice(0,i),id=path.slice(i+1);
    var base=L.s[path]?null:baseCol(c)[id],p=L.p[path];
    if(!base&&!p)return null;
    return merge(base||{},p||{});
  }
  function docsOf(c){
    var ids={},k;for(k in baseCol(c))ids[k]=1;
    for(k in L.p)if(k.indexOf(c+'/')===0)ids[k.slice(c.length+1)]=1;
    var out=[];for(k in ids){var d=docOf(c+'/'+k);if(d)out.push({id:k,d:d})}
    return out;
  }
  function emit(){subs.forEach(function(f){try{f()}catch(e){}})}
  function ref(path){return{
    get:function(){var d=docOf(path);return Promise.resolve({exists:!!d,data:function(){return d}})},
    set:function(v){delete L.d[path];L.s[path]=true;L.p[path]=v;save();emit();return Promise.resolve()},
    update:function(v){L.p[path]=merge(L.p[path]||{},v);save();emit();return Promise.resolve()},
    delete:function(){L.d[path]=true;delete L.p[path];delete L.s[path];save();emit();return Promise.resolve()},
    onSnapshot:function(cb){var f=function(){if(!BASE)return;var d=docOf(path);cb({exists:!!d,data:function(){return d}})};subs.push(f);f();return function(){}}
  }}
  var db={doc:ref,collection:function(c){return{
    doc:function(id){return ref(c+'/'+id)},
    onSnapshot:function(cb){var f=function(){if(!BASE)return;cb({docs:docsOf(c).map(function(x){return{id:x.id,data:function(){return x.d}}})})};subs.push(f);f();return function(){}}
  }}};
  fetch('data/site.json',{cache:'no-cache'}).then(function(r){return r.json()}).then(function(j){BASE=j;emit()}).catch(function(){BASE={collections:{}};emit()});
  window.claude={use:function(n){return Promise.resolve(n==='db'?db:null)}};
})();
