(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{14:function(e,t,a){},15:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),r=a(4),l=a.n(r),o=(a(14),a(2),a(1)),c=a.n(o);var i=function(e){let{isLoggedIn:t,activeContent:a,setSearchResults:r,setActiveContent:l,onLogoutSuccess:o}=e;const[i,m]=Object(n.useState)(""),u="Login"===a||"Register"===a,d="WelcomePage"===a||"Login"===a||"Register"===a;return s.a.createElement("div",{className:"banner"},s.a.createElement("div",null,t&&s.a.createElement("button",{onClick:()=>l("UserProfile"),className:"blue-button"},"User Profile"),s.a.createElement("button",{onClick:async()=>{if(t)try{c.a.remove("authToken"),c.a.remove("userEmail"),(await fetch("/api/logout",{method:"POST"})).ok&&o()}catch(e){console.error("Logout failed:",e)}else l("WelcomePage")},className:"blue-button",disabled:u},"Logout")," "),s.a.createElement("h1",null,"Fake Stack Overflow"),s.a.createElement("input",{type:"text",id:"searchBar",className:"searchBar",placeholder:"Search...",value:i,onChange:e=>m(e.target.value),onKeyUp:async e=>{if("Enter"===e.key&&i.trim()){const e=i.trim();try{const a=await fetch("/api/search?searchTerm=".concat(encodeURIComponent(e)));if(a.ok){const e=await a.json();r(e),console.log(e),l("Searching")}else console.error("Failed to fetch search results")}catch(t){console.error("Error during search:",t)}}},disabled:d}))};var m=function(e){let{setSortedQuestions:t}=e;const a=async e=>{try{const n=await fetch("/api/sorting?sort=".concat(e));if(!n.ok)throw new Error("HTTP error! status: ".concat(n.status));const s=await n.json();t(s)}catch(a){console.error("Failed to fetch and sort questions:",a)}};return s.a.createElement("div",{className:"button-group"},s.a.createElement("button",{onClick:()=>a("newest"),className:"sorting-button"},"Newest"),s.a.createElement("button",{onClick:()=>a("active"),className:"sorting-button"},"Active"),s.a.createElement("button",{onClick:()=>a("unanswered"),className:"sorting-button"},"Unanswered"))};var u=function(e){let{questionId:t,onAnswerSubmit:a}=e;const[r,l]=Object(n.useState)({answerText:"",username:""}),[o,c]=Object(n.useState)({answerTextError:"",usernameError:"",formError:""}),i=(e,t)=>{c(a=>({...a,[e]:a[e]?"".concat(a[e],"\n").concat(t):t}))},m=e=>{const{name:t,value:a}=e.target;l(e=>({...e,[t]:a}))};return s.a.createElement("div",{className:"answer-form"},s.a.createElement("h2",null,"Post Your Answer:"),s.a.createElement("form",{onSubmit:async e=>{e.preventDefault(),c({answerTextError:"",usernameError:"",formError:""});const{answerText:n,username:s}=r;if(n.trim()&&s.trim())if(""!==n.trim())if(""!==s.trim())try{const e=await fetch("/api/questions/".concat(t,"/answers"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:n,ans_by:s})});if(!e.ok)throw new Error("HTTP error! status: ".concat(e.status));a(),l({answerText:"",username:""})}catch(o){console.error("Failed to post answer:",o),alert("Failed to post the answer. Please try again.")}else i("usernameError","Username cannot be empty");else i("answerTextError","Answer text cannot be empty");else i("formError","Answer text and username are required.")}},s.a.createElement("div",{className:"form-container"},s.a.createElement("div",{className:"form-field"},s.a.createElement("label",{htmlFor:"username"},"Username*"),s.a.createElement("input",{type:"text",name:"username",value:r.username,onChange:m,placeholder:"Enter your username"}),s.a.createElement("p",{className:"error-message"},o.usernameError)),s.a.createElement("div",{className:"form-field"},s.a.createElement("label",{htmlFor:"answerText"},"Answer Text*"),s.a.createElement("input",{type:"text",name:"answerText",value:r.answerText,onChange:m,placeholder:"Add details"}),s.a.createElement("p",{className:"error-message"},o.answerTextError)),s.a.createElement("p",{className:"error-message"},o.formError),s.a.createElement("div",{className:"form-field"},s.a.createElement("button",{type:"submit",className:"blue-button"},"Post Answer")))))};var d=function(e){let{question:t,onAskQuestionClick:a}=e;const[r,l]=Object(n.useState)([]),[o,c]=Object(n.useState)(!1),[i,m]=Object(n.useState)(!0);function d(e){let t=0,a="",n=0;for(;t<e.length;){if(-1===(t=e.indexOf("[",t))){a+=e.substring(n);break}a+=e.substring(n,t);const s=e.indexOf("]",t),r=e.indexOf("(",s),l=e.indexOf(")",r);if(-1===s||r!==s+1||-1===l){a+=e.substring(t);break}const o=e.substring(t+1,s),c=e.substring(r+1,l).trim();c.startsWith("http://")||c.startsWith("https://")?a+='<a href="'.concat(c,'" target="_blank" rel="noopener noreferrer">').concat(o,"</a>"):a+="[".concat(o,"](").concat(c,")"),n=t=l+1}return a}function E(e){let{answer:t}=e;return s.a.createElement("table",{className:"question-entry",style:{width:"100%",tableLayout:"fixed"}},s.a.createElement("tbody",null,s.a.createElement("tr",null,s.a.createElement("td",{style:{width:"70%",overflowWrap:"break-word"}},s.a.createElement("div",{dangerouslySetInnerHTML:{__html:d(t.text)}})),s.a.createElement("td",{style:{width:"30%",overflowWrap:"break-word",textAlign:"right"}},s.a.createElement("div",null,s.a.createElement("p",{className:"green-text"},t.ans_by),s.a.createElement("p",{className:"grey-text"},"answered ",function(e){const t=new Date-e,a=Math.floor(t/1e3),n=Math.floor(a/60),s=Math.floor(n/60),r=Math.floor(s/24);return r>=365?"".concat(e.toLocaleString("en-us",{month:"short",day:"numeric",year:"numeric"})," at ").concat(e.toLocaleTimeString("en-us")):r>=1?"".concat(e.toLocaleString("en-us",{month:"short",day:"numeric"})," at ").concat(e.toLocaleTimeString("en-us")):s>=1?"".concat(s," hours ago"):n>=1?"".concat(n," minutes ago"):"".concat(a," seconds ago")}(t.ans_date_time)))))))}return Object(n.useEffect)(()=>{t&&t.answers&&l(t.answers)},[t]),s.a.createElement("div",null,s.a.createElement("table",{className:"question-entry",style:{width:"100%",tableLayout:"fixed"}},s.a.createElement("tbody",null,s.a.createElement("tr",null,s.a.createElement("td",{style:{width:"20%"}},"Answers: ",r.length),s.a.createElement("td",{style:{width:"60%"}},s.a.createElement("h2",null,t.title)),s.a.createElement("td",{style:{width:"20%",textAlign:"right"}},s.a.createElement("button",{id:"askQuestionBtn",className:"blue-button",onClick:a},"Ask Question"))),s.a.createElement("tr",null,s.a.createElement("td",null,"Views: ",t.views),s.a.createElement("td",{colSpan:"2"},s.a.createElement("div",{dangerouslySetInnerHTML:{__html:d(t.text)}}))),r.map((e,t)=>s.a.createElement(E,{key:t,answer:e})))),o&&s.a.createElement(u,{questionId:t._id,onAnswerSubmit:()=>{c(!1)}}),s.a.createElement("div",null,s.a.createElement("button",{id:"askAnswerBtn",className:"blue-button",onClick:()=>{c(!0),m(!1)}},"Answer Question")))};var E=function(e){let{addQuestionToList:t,onSuccess:a,setActiveContent:r}=e;const l=c.a.get("userEmail");Object(n.useEffect)(()=>{l&&i(e=>({...e,email:l}))},[l]);const[o,i]=Object(n.useState)({questionTitle:"",questionSummary:"",questionText:"",questionTags:"",username:l}),[m,u]=Object(n.useState)({questionTitleError:"",questionSummaryError:"",questionTextError:"",questionTagsError:"",usernameError:"",formError:""}),d=(e,t)=>{u(a=>({...a,[e]:a[e]?"".concat(a[e],"\n").concat(t):t}))},E=e=>{const{id:t,value:a}=e.target;i(e=>({...e,[t]:a}))};let g="inactive",h="inactive";return s.a.createElement("div",{id:"newQuestionForm"},s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#",id:"questionsLink",className:g,onClick:()=>{r("AllQuestionList"),g="active",h="inactive"}},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#",id:"tagsLink",className:h,onClick:()=>{r("TagsContent"),g="inactive",h="active"}},"Tags")))),s.a.createElement("div",{className:"form-field"},s.a.createElement("label",{htmlFor:"questionTitle"},"Question Title*"),s.a.createElement("p",null,s.a.createElement("span",{className:"error-message",id:"questionTitleError"},m.questionTitleError)),s.a.createElement("input",{type:"text",id:"questionTitle",value:o.questionTitle,onChange:E,placeholder:"Enter question title (max 100 characters)",className:"form-input","data-hint":"limit title to 100 characters or less",autoComplete:"off",required:!0})),s.a.createElement("div",{className:"form-field"},s.a.createElement("label",{htmlFor:"questionSummary"},"Question Summary*"),s.a.createElement("p",null,s.a.createElement("span",{className:"error-message",id:"questionSummaryError"},m.questionSummaryError)),s.a.createElement("input",{type:"text",id:"questionSummary",value:o.questionSummary,onChange:E,placeholder:"Question Summary (max 200 characters)",className:"form-input","data-hint":"limit summary to 200 characters or less",autoComplete:"off",required:!0}),s.a.createElement("div",{className:"error-message"},m.questionSummaryError)),s.a.createElement("div",{className:"form-field"},s.a.createElement("label",{htmlFor:"questionText"},"Question Text*"),s.a.createElement("p",null,s.a.createElement("span",{className:"error-message",id:"questionTextError"},m.questionTextError)),s.a.createElement("input",{type:"text",id:"questionText",value:o.questionText,onChange:E,placeholder:"Enter question details",className:"form-input","data-hint":"Add details",autoComplete:"off",required:!0})),s.a.createElement("div",{className:"form-field"},s.a.createElement("label",{htmlFor:"questionTags"},"Tags*"),s.a.createElement("p",null,s.a.createElement("span",{className:"error-message",id:"questionTagsError"},m.questionTagsError)),s.a.createElement("input",{type:"text",id:"questionTags",value:o.questionTags,onChange:E,placeholder:"Enter tags separated by whitespace",className:"form-input","data-hint":"Add keywords separated by whitespace",autoComplete:"off",required:!0})),s.a.createElement("div",{className:"form-field"},s.a.createElement("label",{htmlFor:"username"},"Username*"),s.a.createElement("p",null,s.a.createElement("span",{className:"error-message",id:"usernameError"},m.usernameError)),s.a.createElement("input",{type:"text",id:"username",value:o.username,readOnly:!0,className:"form-input",autoComplete:"off",required:!0})),s.a.createElement("button",{id:"postQuestionBtn",className:"blue-button",onClick:async()=>{u({questionTitleError:"",questionSummaryError:"",questionTextError:"",questionTagsError:"",usernameError:"",formError:""});const{questionTitle:e,questionSummary:n,questionText:s,questionTags:r,username:l}=o,c=r.split(" ").filter(e=>e);if(""===e&&""===n&&""===s&&""===r&&""===l)return void d("formError","Please fill in all required fields.");let m=!0,E=0;for(;E<s.length&&-1!==(E=s.indexOf("[",E));){const e=s.indexOf("]",E);if(-1===e){d("questionTextError","Missing closing bracket for a link."),m=!1;break}const t=s.indexOf("(",e);if(t!==e+1){d("questionTextError","Missing opening parenthesis for a link after the closing bracket."),m=!1;break}const a=s.indexOf(")",t);if(-1===a){d("questionTextError","Missing closing parenthesis for a link."),m=!1;break}const n=s.substring(t+1,a).trim();if(!n.startsWith("http://")&&!n.startsWith("https://")){d("questionTextError",'URL must begin with "http://" or "https://".'),m=!1;break}E=a+1}if(""===n?(d("questionSummaryError","Question summary cannot be empty"),m=!1):n.length>200&&(d("questionSummaryError","Question summary must be 200 characters or less"),m=!1),(""===e||e.length>100)&&(d("questionTitleError","Title must be between 1 and 100 characters"),m=!1),""===s&&(d("questionTextError","Question text cannot be empty"),m=!1),""===r)d("questionTagsError","Please add at least one tag"),m=!1;else{c.length>5&&(d("questionTagsError","Cannot add more than 5 tags"),m=!1);for(const e of c)if(e.length>20){d("questionTagsError","Tag cannot be more than 20 characters"),m=!1;break}(function(e){return new Set(e).size!==e.length})(c)&&(d("questionTagsError","Duplicate tags not allowed"),m=!1)}if(""===l&&(d("usernameError","Username cannot be empty"),m=!1),m)try{const r=await fetch("/api/questions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:e,summary:n,text:s,tagNames:c,asked_by:l||"Anonymous"})});if(r.ok){const e=await r.json();t(e),a(),i({questionTitle:"",questionSummary:"",questionText:"",questionTags:"",username:""})}else{const e=await r.json();d("formError",e.message||"Failed to post question. Please try again.")}}catch(g){console.error("Error posting question:",g),d("formError","Error posting question. Please try again.")}}},"Post Question"),s.a.createElement("p",null,s.a.createElement("span",{className:"error-message",id:"formError"},m.formError)),s.a.createElement("p",null,"* indicates required fields"))};var g=function(e){let{isLoggedIn:t,activeContent:a,setActiveContent:r}=e;console.log(t);const[l,o]=Object(n.useState)([]),[c,i]=Object(n.useState)(null),[u,g]=Object(n.useState)(!1),[h,f]=Object(n.useState)(!1),[p,v]=Object(n.useState)(0),w=Math.ceil(l.length/5);Object(n.useEffect)(()=>{(async()=>{try{const t=await fetch("/api/questions");if(!t.ok)throw console.error("Failed to fetch questions"),new Error("Could not fetch questions.");{const e=await t.json();o(e),console.log(e)}}catch(e){console.error("Error fetching questions:",e)}})()},[]);const b=()=>{g(!0)},y=l.slice(5*p,5*(p+1));let N,k="active";return s.a.createElement("div",{id:"questionList",style:{minHeight:"400px"}},s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#",id:"questionsLink",className:"active",onClick:()=>{r("AllQuestionList"),k="active",N="inactive"}},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#",id:"tagsLink",className:"inactive",onClick:()=>{r("TagsContent"),k="inactive",N="active"}},"Tags")))),u?s.a.createElement(E,{activeContent:a,setActiveContent:r,addQuestionToList:e=>{o(t=>[{...e,id:t.length+1},...t])},onSuccess:()=>{g(!1),r("AllQuestionList")}}):h&&c?s.a.createElement(d,{question:c,onAskQuestionClick:b,disabled:!t}):s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"header-row",id:"header-row"},s.a.createElement("h2",{id:"allQuestionTitle",className:"title"},"All Questions"),t&&s.a.createElement("button",{id:"askQuestionBtn",className:"blue-button",onClick:b},"Ask Question")),s.a.createElement("div",{className:"button-row",id:"button-row"},s.a.createElement("p",{id:"totalNumQues",className:"button-text"},s.a.createElement("span",{id:"totalQuestions"},l.length)," questions"),s.a.createElement(m,{setSortedQuestions:e=>{o(e)}})),s.a.createElement("div",{id:"allQuestionList",style:{overflowY:"auto"}},0===l.length?s.a.createElement("p",null,"No questions found."):y.map(e=>{var t,a;return s.a.createElement("div",{key:e._id,className:"question-entry",onClick:()=>(async e=>{f(!0),i(e)})(e)},s.a.createElement("div",{className:"title-row",style:{display:"flex",alignItems:"center"}},s.a.createElement("div",{className:"answer-views",style:{paddingRight:"15px"}},s.a.createElement("p",{className:"grey-text"},"Answers: ",(null===(t=e.answers)||void 0===t?void 0:t.length)||0),s.a.createElement("p",{className:"grey-text"},"Views: ",e.views)),s.a.createElement("h2",{className:"blue-text"},e.title),s.a.createElement("div",{style:{marginLeft:"auto",display:"flex",alignItems:"center"}},s.a.createElement("p",{className:"red-text"},e.asked_by),s.a.createElement("p",{className:"grey-text"},"asked ",(e=>{const t=new Date-new Date(e),a=Math.floor(t/1e3),n=Math.floor(a/60),s=Math.floor(n/60),r=Math.floor(s/24);return r>=365?"".concat(new Date(e).toLocaleString("en-us",{month:"short",day:"numeric",year:"numeric"})," at ").concat(new Date(e).toLocaleTimeString("en-us")):r>=1?"".concat(new Date(e).toLocaleString("en-us",{month:"short",day:"numeric"})," at ").concat(new Date(e).toLocaleTimeString("en-us")):s>=1?"".concat(s," hours ago"):n>=1?"".concat(n," minutes ago"):"".concat(a," seconds ago")})(e.ask_date_time)))),s.a.createElement("p",{className:"question-summary"},e.summary),s.a.createElement("div",{className:"tag-containerQuest"},null===(a=e.tags)||void 0===a?void 0:a.map(e=>s.a.createElement("span",{key:e._id,className:"tag"},e.name))))}),w>1&&s.a.createElement("div",{className:"pagination-controls",style:{textAlign:"center",paddingTop:"10px"}},s.a.createElement("button",{onClick:()=>{p>0&&v(p-1)},disabled:0===p},"Prev"),s.a.createElement("span",null,"Page ",p+1," of ",w)," ",s.a.createElement("button",{onClick:()=>{v(p<w-1?p+1:0)},disabled:p===w-1},"Next")))))};var h=function(e){let{isLoggedIn:t,tagName:a,activeContent:r,setActiveContent:l}=e;const[o,c]=Object(n.useState)([]),[i,m]=Object(n.useState)(null),[u,E]=Object(n.useState)(!1);return Object(n.useEffect)(()=>{(async()=>{try{const t=await fetch("/api/questions/tag/".concat(a));if(!t.ok)throw new Error("HTTP error! status: ".concat(t.status));const n=await t.json();c(n)}catch(e){console.error("Error fetching questions for tag:",e)}})()},[a]),s.a.createElement("div",{id:"tagResults"},u&&i?s.a.createElement(d,{question:i}):s.a.createElement(s.a.Fragment,null,s.a.createElement("h2",{id:"tagResultsTitle"},"[",a,"] Tag Results"),0===o.length?s.a.createElement("p",null,"No questions found for tag ",a,"."):o.map(e=>s.a.createElement("div",{key:e._id,className:"question-entry"},s.a.createElement("div",{onClick:()=>{E(!0),m(e)}},s.a.createElement("h3",null,e.title))))))};var f=function(e){let{isLoggedIn:t,activeContent:a,setActiveContent:r}=e;const[l,o]=Object(n.useState)([]),[c,i]=Object(n.useState)(!1),[m,u]=Object(n.useState)(null),[d,g]=Object(n.useState)(!1);Object(n.useState)([])[1],Object(n.useEffect)(()=>{(async()=>{try{const t=await fetch("/api/tags");if(!t.ok)throw new Error("Failed to fetch tags");const a=await t.json();o(a)}catch(e){console.error("Error fetching tags:",e)}})()},[]);let f="inactive",p="active";return s.a.createElement("div",{id:"tag-container"},s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#questions",id:"questionsLink",className:"AllQuestionList"===a?"active":"inactive",onClick:()=>{r("AllQuestionList"),f="active",p="inactive"}},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#tags",id:"tagsLink",className:"TagsContent"===a?"active":"inactive",onClick:()=>{r("TagsContent"),f="inactive",p="active"}},"Tags")))),c?s.a.createElement(E,{setActiveContent:r,onSuccess:()=>{i(!1),r("AllQuestionList")}}):s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"header-row",id:"header-row"},s.a.createElement("h2",{id:"allQuestionTitle",className:"title"},"All Tags"),t&&s.a.createElement("button",{id:"askQuestionBtn",className:"blue-button",onClick:()=>i(!0)},"Ask Question")),s.a.createElement("div",{className:"tag-header-row",id:"tag-header-row"},s.a.createElement("p",{id:"totalNumTags",className:"button-text"},s.a.createElement("span",{id:"totalQuestions"},l.length)," tags")),s.a.createElement("div",{className:"tag-container-table"},l.map(e=>s.a.createElement("div",{key:e.name,className:"tag-box"},s.a.createElement("a",{href:"#tag",className:"tag-link",onClick:()=>{g(!0),u(e.name)}},e.name),s.a.createElement("span",{className:"num-questions"},e.count||0," questions")))),d&&m&&s.a.createElement(h,{tagName:m})))};var p=function(e){let{isLoggedIn:t,searchResults:a,activeContent:r,setActiveContent:l}=e;const[o,c]=Object(n.useState)([]),[i,u]=Object(n.useState)(null),[g,h]=Object(n.useState)(!1),[f,p]=Object(n.useState)(!1),[v,w]=Object(n.useState)(0),b=Math.ceil(a.length/5);Object(n.useEffect)(()=>{(async()=>{try{const t=await fetch("/api/search?searchTerm=".concat(encodeURIComponent("example")));if(!t.ok)throw new Error("Failed to fetch search results");{const e=await t.json();c(e)}}catch(e){console.error("Error fetching search results:",e)}})()},[]);const y=()=>{h(!0)};return a=a.slice(5*v,5*(v+1)),s.a.createElement("div",{id:"Searching"},s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#",className:"active",onClick:()=>l("AllQuestionList")},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#",className:"inactive",onClick:()=>l("TagsContent")},"Tags")))),g?s.a.createElement(E,{activeContent:r,setActiveContent:l,onSuccess:()=>{h(!1),l("AllQuestionList")}}):f&&i?s.a.createElement(d,{question:i,onAskQuestionClick:y}):s.a.createElement(s.a.Fragment,null,s.a.createElement("div",{className:"header-row"},s.a.createElement("h2",{className:"title"},"Search Results"),t&&s.a.createElement("button",{className:"blue-button",onClick:y,disabled:!t},"Ask Question")),s.a.createElement("div",{className:"button-row"},s.a.createElement("p",{className:"button-text"},s.a.createElement("span",null,a.length)," questions"),s.a.createElement(m,{setSortedQuestions:e=>{c(e)}})),s.a.createElement("div",{id:"allQuestionList"},0===a.length?s.a.createElement("p",null,"No questions found."):a.map(e=>{var t,a;return s.a.createElement("div",{key:e._id,className:"question-entry",onClick:()=>(async e=>{p(!0),u(e)})(e)},s.a.createElement("div",{className:"title-row",style:{display:"flex",alignItems:"center"}},s.a.createElement("div",{className:"answer-views",style:{paddingRight:"15px"}},s.a.createElement("p",{className:"grey-text"},"Answers: ",(null===(t=e.answers)||void 0===t?void 0:t.length)||0),s.a.createElement("p",{className:"grey-text"},"Views: ",e.views)),s.a.createElement("h2",{className:"blue-text"},e.title),s.a.createElement("div",{style:{marginLeft:"auto",display:"flex",alignItems:"center"}},s.a.createElement("p",{className:"red-text"},e.asked_by),s.a.createElement("p",{className:"grey-text"},"asked ",(e=>{const t=new Date-new Date(e),a=Math.floor(t/1e3),n=Math.floor(a/60),s=Math.floor(n/60),r=Math.floor(s/24);return r>=365?"".concat(new Date(e).toLocaleString("en-us",{month:"short",day:"numeric",year:"numeric"})," at ").concat(new Date(e).toLocaleTimeString("en-us")):r>=1?"".concat(new Date(e).toLocaleString("en-us",{month:"short",day:"numeric"})," at ").concat(new Date(e).toLocaleTimeString("en-us")):s>=1?"".concat(s," hours ago"):n>=1?"".concat(n," minutes ago"):"".concat(a," seconds ago")})(e.ask_date_time)))),s.a.createElement("p",{className:"question-summary"},e.summary),s.a.createElement("div",{className:"tag-containerQuest"},null===(a=e.tags)||void 0===a?void 0:a.map(e=>s.a.createElement("span",{key:e._id,className:"tag"},e.name))))}),b>1&&s.a.createElement("div",{className:"pagination-controls",style:{textAlign:"center",paddingTop:"10px"}},s.a.createElement("button",{onClick:()=>{v>0&&w(v-1)},disabled:0===v},"Prev"),s.a.createElement("span",null,"Page ",v+1," of ",b)," ",s.a.createElement("button",{onClick:()=>{w(v<b-1?v+1:0)},disabled:v===b-1},"Next")))))};var v=function(e){let{setActiveContent:t}=e;return s.a.createElement("div",{id:"welcomePage_Content",style:{minHeight:"400px"}},s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#",className:"inactive"},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#",className:"inactive"},"Tags")))),s.a.createElement("div",null,s.a.createElement("h1",null,"Welcome to Fake Stack Overflow!"),s.a.createElement("button",{onClick:()=>t("Register"),className:"sorting-button"},"Create Account")," ",s.a.createElement("button",{onClick:()=>t("Login"),className:"sorting-button"},"Login")," ",s.a.createElement("button",{onClick:()=>t("AllQuestionList"),className:"sorting-button"},"Continue as Guest")," "))};var w=function(e){let{onLoginSuccess:t,setActiveContent:a}=e;const[r,l]=Object(n.useState)(""),[o,i]=Object(n.useState)(""),[m,u]=Object(n.useState)("");return s.a.createElement("div",{id:"login",className:"login-form"},s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#",className:"inactive"},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#",className:"inactive"},"Tags")))),s.a.createElement("div",{className:"header-row"},s.a.createElement("h2",null,"Login"),s.a.createElement("button",{onClick:()=>{a("WelcomePage")},className:"sorting-button"},"Back")," "),s.a.createElement("form",{onSubmit:async e=>{e.preventDefault();try{const e=await fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:r,password:o})});if(!e.ok){const t=await e.json();throw new Error(t.message)}const n=(await e.json()).token;c.a.set("authToken",n,{expires:7,path:"/"}),c.a.set("userEmail",r,{expires:7,path:"/"}),t(),a("AllQuestionList")}catch(m){u(m.message)}}}," ",s.a.createElement("input",{type:"email",name:"email",value:r,onChange:e=>l(e.target.value),placeholder:"Email (Username)",required:!0}),s.a.createElement("input",{type:"password",name:"password",value:o,onChange:e=>i(e.target.value),placeholder:"Password",required:!0}),s.a.createElement("button",{type:"submit",className:"blue-button"},"Login")," "),m&&s.a.createElement("div",{style:{color:"red"}},m)," ")};var b=function(e){let{onRegisterSuccess:t,setActiveContent:a}=e;const[r,l]=Object(n.useState)({firstName:"",lastName:"",email:"",password:"",passwordVerification:""}),[o,c]=Object(n.useState)(""),i=e=>{const{name:t,value:a}=e.target;l(e=>({...e,[t]:a}))};return s.a.createElement("div",{id:"registerForm",className:"login-form"},s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#",className:"inactive"},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#",className:"inactive"},"Tags")))),s.a.createElement("div",{className:"header-row"},s.a.createElement("h2",null,"Register"),s.a.createElement("button",{onClick:()=>{a("WelcomePage")},className:"sorting-button"},"Back")),s.a.createElement("form",{onSubmit:async e=>{e.preventDefault();const n=(()=>{const{firstName:e,lastName:t,email:a,password:n,passwordVerification:s}=r;return a.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)?n.includes(e)||n.includes(t)||n.includes(a)?"Password cannot contain your name or email.":n!==s?"Passwords do not match.":null:"Invalid email format."})();if(n)c(n);else try{const e=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)});if(!e.ok){if(await e.json(),409!==e.status){const t=await e.json();throw console.log(t),new Error("Failed to register.")}return void c("Email already in use. Please use a different email.")}console.log("successful creation"),t(),console.log("parent notified of sucess"),a("Login")}catch(o){c(o.message)}}},s.a.createElement("input",{type:"text",name:"firstName",value:r.firstName,onChange:i,placeholder:"First Name",required:!0}),s.a.createElement("input",{type:"text",name:"lastName",value:r.lastName,onChange:i,placeholder:"Last Name",required:!0}),s.a.createElement("input",{type:"email",name:"email",value:r.email,onChange:i,placeholder:"Email (Username)",required:!0}),s.a.createElement("input",{type:"password",name:"password",value:r.password,onChange:i,placeholder:"Secret Password",required:!0}),s.a.createElement("input",{type:"password",name:"passwordVerification",value:r.passwordVerification,onChange:i,placeholder:"Verify Password",required:!0}),s.a.createElement("button",{type:"submit",className:"blue-button"},"Sign Up")),o&&s.a.createElement("div",{style:{color:"red"}},o))};var y=function(e){let{userId:t,setActiveContent:a,setSelectedQuestion:r,setSelectedAnswer:l}=e;const[o,i]=Object(n.useState)(null),[m,u]=Object(n.useState)([]),[d,E]=Object(n.useState)([]),[g,h]=Object(n.useState)([]),f=c.a.get("userEmail");console.log("User Email:",f),Object(n.useEffect)(()=>{f?(async()=>{try{console.log("Fetching user data from:","/api/user/".concat(encodeURIComponent(f)));const t=await fetch("/api/user/".concat(encodeURIComponent(f)));if(console.log("response:",t),t.ok){const e=await t.json();console.log("User Data:",e),i(e.user),u(e.questions),E(e.tags),h(e.answers)}else console.error("Failed to fetch user data")}catch(e){console.error("Error fetching user data:",e)}})():console.error("User email is undefined")},[f]);let p="inactive";const v=()=>{a("AllQuestionList"),p="active",w="inactive"};let w="inactive";const b=()=>{a("TagsContent"),p="inactive",w="active"};if(!o)return s.a.createElement("div",null,s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#",id:"questionsLink",className:"inactive",onClick:v},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#",id:"tagsLink",className:"inactive",onClick:b},"Tags")))),s.a.createElement("div",null,"User not found"));const y=m.length>0,N=d.length>0,k=g.length>0;return s.a.createElement("div",{className:"user-profile"},s.a.createElement("div",{id:"menu",className:"menu"},s.a.createElement("ul",null,s.a.createElement("li",null,s.a.createElement("a",{href:"#",id:"questionsLink",className:"inactive",onClick:v},"Questions")),s.a.createElement("li",null,s.a.createElement("a",{href:"#",id:"tagsLink",className:"inactive",onClick:b},"Tags")))),s.a.createElement("h1",null,o.firstName," ",o.lastName),s.a.createElement("p",null,"Email: ",f)," ",s.a.createElement("h2",null,"Membership"),s.a.createElement("p",null,"Member since: ",(e=>{const t=new Date-new Date(e),a=Math.floor(t/1e3),n=Math.floor(a/60),s=Math.floor(n/60),r=Math.floor(s/24);return r>=365?"".concat(new Date(e).toLocaleString("en-us",{month:"short",day:"numeric",year:"numeric"})," at ").concat(new Date(e).toLocaleTimeString("en-us")):r>=1?"".concat(new Date(e).toLocaleString("en-us",{month:"short",day:"numeric"})," at ").concat(new Date(e).toLocaleTimeString("en-us")):s>=1?"".concat(s," hours ago"):n>=1?"".concat(n," minutes ago"):"".concat(a," seconds ago")})(o.createdAt)),s.a.createElement("p",null,"Reputation: ",o.reputation||0),s.a.createElement("h2",null,"Questions Posted"),y?s.a.createElement("ul",null,m.map(e=>s.a.createElement("li",{key:e._id},s.a.createElement("span",{onClick:()=>{r(e._id),a("EditQuestion")}},e.title),s.a.createElement("button",{onClick:()=>(async e=>{try{if(!(await fetch("/api/questions/".concat(e),{method:"DELETE"})).ok)throw new Error("Failed to delete question");u(t=>t.filter(t=>t._id!==e))}catch(t){console.error("Error deleting question:",t)}})(e._id)},"Delete")))):s.a.createElement("p",null,"No data found for ",o.firstName," ",o.lastName,"."),s.a.createElement("h2",null,"Tags"),N?s.a.createElement("ul",null,d.map(e=>s.a.createElement("li",{key:e._id},s.a.createElement("span",null,e.name),s.a.createElement("button",{onClick:()=>(async e=>{try{if(!(await fetch("/api/tags/".concat(e),{method:"DELETE"})).ok)throw new Error("Failed to delete tag");E(t=>t.filter(t=>t._id!==e))}catch(t){console.error("Error deleting tag:",t)}})(e._id)},"Delete")))):s.a.createElement("p",null,"No data found for ",o.firstName," ",o.lastName,"."),s.a.createElement("h2",null,"Answers"),k?s.a.createElement("ul",null,g.map(e=>s.a.createElement("li",{key:e._id},s.a.createElement("span",{onClick:()=>{l(e._id),a("EditAnswer")}},e.questionTitle),s.a.createElement("button",{onClick:()=>(async e=>{try{(await fetch("/api/answers/".concat(e),{method:"DELETE"})).ok?h(t=>t.filter(t=>t._id!==e)):console.error("Failed to delete answer")}catch(t){console.error("Error deleting answer:",t)}})(e._id)},"Delete")))):s.a.createElement("p",null,"No data found for ",o.firstName," ",o.lastName,"."))};var N=function(){const[e,t]=Object(n.useState)("WelcomePage"),[a,r]=Object(n.useState)([]),[l,o]=Object(n.useState)(!1),[m,d]=Object(n.useState)(!1);Object(n.useEffect)(()=>{c.a.get("userSession")?(o(!0),t("AllQuestionList")):m&&t("WelcomePage")},[m]);const h=()=>{o(!0),t("AllQuestionList")},N=()=>{t("Login")};return s.a.createElement("div",{className:"fakestackoverflow"},s.a.createElement(i,{isLoggedIn:l,onLogoutSuccess:()=>{o(!1),d(!0)},activeContent:e,setSearchResults:r,setActiveContent:t}),s.a.createElement("div",{className:"content"},(()=>{switch(e){case"WelcomePage":return s.a.createElement(v,{activeContent:e,setActiveContent:t});case"UserProfile":return s.a.createElement(y,{activeContent:e,setActiveContent:t});case"AllQuestionList":return s.a.createElement(g,{isLoggedIn:l,activeContent:e,setActiveContent:t,searchResults:a});case"NewQuestionForm":return s.a.createElement(E,{activeContent:e,setActiveContent:t,searchResults:a});case"Answers":return s.a.createElement(u,{activeContent:e,setActiveContent:t,searchResults:a});case"TagsContent":return s.a.createElement(f,{isLoggedIn:l,activeContent:e,setActiveContent:t,searchResults:a});case"Searching":return s.a.createElement(p,{isLoggedIn:l,activeContent:e,setActiveContent:t,searchResults:a,setSearchResults:r});case"Login":return s.a.createElement(w,{onLoginSuccess:h,activeContent:e,setActiveContent:t});case"Register":return s.a.createElement(b,{onRegisterSuccess:N,activeContent:e,setActiveContent:t});default:return null}})()))};var k=function(){return s.a.createElement("section",{className:"fakeso"},s.a.createElement(N,null))};l.a.createRoot(document.getElementById("root")).render(s.a.createElement(k,null))},2:function(e,t,a){},5:function(e,t,a){e.exports=a(15)}},[[5,1,2]]]);
//# sourceMappingURL=main.ce9f4a8d.chunk.js.map