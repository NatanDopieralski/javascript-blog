'use strict';
{
  const templates = {
    // eslint-disable-next-line no-undef
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    // eslint-disable-next-line no-undef
    articleTagss: Handlebars.compile(document.querySelector('#template-article-tagss').innerHTML),
    // eslint-disable-next-line no-undef
    articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
    // eslint-disable-next-line no-undef
    tagCloudLink: Handlebars.compile(document.querySelector('#template-article-tag-cloud').innerHTML),
    // eslint-disable-next-line no-undef
    authorRight: Handlebars.compile(document.querySelector('#template-article-author-right').innerHTML),
  };
  




  const titleClickHandler = function(event){
    //console.log('Link was clicked!');

    /* [DONE] remove class 'active' from all article links  */

    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }

    /* [DONE] add class 'active' to the clicked link */
    event.preventDefault();
    const clickedElement = this;
    //console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* [DONE] remove class 'active' from all articles */

    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
      activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */

    const articleSelector = clickedElement.getAttribute('href');
    //console.log(articleSelector);


    /* find the correct article using the selector (value of 'href' attribute) */

    const targetArticle = document.querySelector(articleSelector);
    //console.log(targetArticle);
    /* add class 'active' to the correct article */

    targetArticle.classList.add('active');
  };




  const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author',
    optCloudClassCount = '5',
    optCloudClassPrefix = 'tag-size-';


  function generateTitleLinks(customSelector = ''){
    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = '';
    for(let article of articles){
      /* get the article id */
      const articleId = article.getAttribute('id');
      //console.log(articleId);
      /* find the title element and get the title from the title element */
      const articleTitle = article.querySelector(optTitleSelector).innerHTML;
      /* create HTML of the link */
      //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);



      //console.log(linkHTML);
      /* insert link into titleList */
      //titleList.innerHTML = titleList.innerHTML + linkHTML;
      //titleList.insertAdjacentHTML('afterend', linkHTML);
      html = html + linkHTML;
    }
    titleList.innerHTML = html; //create links list


    //move from titleClickHandler to generateTitleLinks
    const links = document.querySelectorAll('.titles a');
    //console.log(links);

    for(let link of links){
      link.addEventListener('click', titleClickHandler); //click type event

    }
  }
  generateTitleLinks();


  function calculateTagsParams(tags) {
    const params = {
      max: 0,
      min: 999999,
    };

    for(let tag in tags){
      //console.log(tag + ' is used ' + tags[tag] + ' times');
      if(tags[tag] > params.max){
        params.max = tags[tag];
      }
      if(tags[tag] < params.min){
        params.min = tags[tag];
      }
    }
    return params;
  }

  function calculateTagClass (count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

    return optCloudClassPrefix + classNumber;
  }

  function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    /* find all articles */

    const articles = document.querySelectorAll(optArticleSelector);
    //console.log(articles)

    /* START LOOP: for every article: */
    for(let article of articles){
      /* find tags wrapper */
      const tagsList = article.querySelector(optArticleTagsSelector);
      //console.log(tagsList);
      /* make html variable with empty string */
      let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      //console.log(articleTags)
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      //console.log(articleTagsArray)
      /* START LOOP: for each tag */
      for(let tag of articleTagsArray){
        /* generate HTML of the link */
        //const linkHTML = '<li><a href="#tag-' + tag + '"><span>'+  tag + '</span></a> '+ '&nbsp;'+'</li>';

        const linkHTMLData = {tag: tag,};
        const linkHTML = templates.articleTagss(linkHTMLData);

        //console.log(linkHTML);
        /* add generated code to html variable */
        html = html + linkHTML;
        //console.log(html);
        /* [NEW] check if this link is NOT already in allTags */
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
      /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagsList.innerHTML = html;
    /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');

    /* [NEW] create variable for all links HTML code */
    const tagsParams = calculateTagsParams(allTags);
    //console.log('tagsParams:', tagsParams);
    //let allTagsHTML = '';
    const allTagsData = {tags: []};

    /* [NEW] START LOOP: for each tag in allTags: */
    for(let tag in allTags){
    /* [NEW] generate code of a link and add it to allTagsHTML */
      //allTagsHTML += '<a class="' +  calculateTagClass(allTags[tag], tagsParams)  + '" href="#tag-' + tag + '"><span>' + tag  + '</span></a> '+ '&nbsp;';
      

      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });




    /* [NEW] END LOOP: for each tag in allTags: */
    }
    /*[NEW] add HTML from allTagsHTML to tagList */
    //tagList.innerHTML = allTagsHTML;
    tagList.innerHTML = templates.tagCloudLink(allTagsData);

    //console.log(allTagsData);
  }




  generateTags();


  function tagClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeArticles = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for(let activeArticle of activeArticles){
      /* remove class active */
      activeArticle.classList.remove('active');
    /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const tagsLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    //console.log(clickedElement);
    for(let tagLink of tagsLinks){
    /* add class active */
      tagLink.classList.add('active');
    /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags(){
    /* find all links to tags */
    const AllTagsLinks = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for(let link of AllTagsLinks){
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
  }

  addClickListenersToTags();


  function generateAuthors(){
    let allAuthors = {};
    /* find all articles */

    const articles = document.querySelectorAll(optArticleSelector);
    //console.log(articles)

    /* START LOOP: for every article: */
    for(let article of articles){
      /* find authors wrapper */
      const AuthorList = article.querySelector(optArticleAuthorSelector);

      /* make html variable with empty string */
      let html = '';
      /* get authors from data-author attribute */
      const articleAuthors = article.getAttribute('data-author');
      //console.log(articleAuthors)

      /* generate HTML of the link */
      //const linkHTML = '<a href="#author-' + articleAuthors + '"><span>'+  articleAuthors + '</span></a>';

      const linkHTMLData = {articleAuhors: articleAuthors,};
      const linkHTML = templates.articleAuthor(linkHTMLData);



      if(!allAuthors[linkHTML]) {

        allAuthors[linkHTML] = 1;
      } else {
        allAuthors[linkHTML]++;
      }
      /* add generated code to html variable */
      html = html + linkHTML;
      /* insert HTML of all the links into the authors wrapper */
      AuthorList.innerHTML = html;
    /* END LOOP: for every article: */
    }
    const authorList = document.querySelector('.authors');
    //let allAuthorsHTML = '';
    const allAuthorsData = {authors: []};
    for(let author in allAuthors){
      //allAuthorsHTML += '<li>' + author + ' (' + allAuthors[author] + ') ' + '</li>';

      allAuthorsData.authors.push({
        author: author,

      });
    }
    //authorList.innerHTML = allAuthorsHTML;
    authorList.innerHTML = templates.authorRight(allAuthorsData);
  }
  generateAuthors();


  function authorClickHandler(event){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    //console.log(clickedElement);
    /* make a new constant "author" and extract tag from the "href" constant */
    const author = href.replace('#author-', '');
    /* find all author links with class active */
    const activeArticles = document.querySelectorAll('a.active[href^="#author-"]');
    //console.log(activeArticles);
    /* START LOOP: for each active author link */
    for(let activeArticle of activeArticles){
      /* remove class active */
      activeArticle.classList.remove('active');
    /* END LOOP: for each active author link */
    }
    /* find all author links with "href" attribute equal to the "href" constant */
    const AuthorsLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found author link */
    //console.log(clickedElement);
    /* add class active */
    for(let authorLink of AuthorsLinks){
      authorLink.classList.add('active');
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
  }

  function addClickListenersToAuthors(){
    /* find all links to tags */
    const AllAuthorLinks = document.querySelectorAll('a[href^="#author-"]');
    /* START LOOP: for each link */
    for(let link of AllAuthorLinks){
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', authorClickHandler);
    /* END LOOP: for each link */
    }
  }

  addClickListenersToAuthors();


}