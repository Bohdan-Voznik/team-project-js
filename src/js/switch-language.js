// import ServiceApi from './js/header';
// const API = ServiceApi();
// console.log(api.fetchTrending)


export default class LanguageApi {
    constructor (){
        this.select='en';
        this.tranclater = {
       right :{
            
    en: "2020 | All Rights Reserved",
    ua:"2020 | Все права защищены",
        
            
        },
        developed: {
            en: "Developed with",
            ua:"Разработано с",
        },
        goit: {
            en: "GoIT Students",
            ua:"GoIT Студентами",
        },
    }
        
    }
   changeDataSet(){
        let lang = this.select.value;
        this.select.dataset.language =lang;
        
        // console.log(lang)
    }
    changeLanguage(fn){
        
        const lang = this.select.dataset.language
        console.log(lang);
        Object.keys(this.tranclater).map(key=>{
            // console.log((key));
         fn(key,lang) 
            })
       
    }
}




// 
// console.log(select)

// const  allLang=['en','ua'];

// 


// changeURLLanguage()