import express from 'express';
// controllers
import content from '../controllers/content.js';

const router = express.Router();

router
  .post('/bnb/newsletters', content.onPostContentBnbNewsletters)
  .get('/bnb/newsletters', content.onGetContentBnbNewsletters)
  .get('/specialtag/new', content.onGetContentWithSpecialTagNEW)
  .get('/specialtag/hot', content.onGetContentWithSpecialTagHOT)
  .get('/bnb/:type?/:videoID?', content.onGetContentBnb)
  .get('/lists/:listName', content.onGetList)
  .get('/types', content.onGetContentTypes)
  .post('/types', content.onPostContentWithType)
  .get('/check', content.onGetContentWithType)
  .get('/status', content.onGetContentStatus)
  .get('/topContent', content.onTopContent)
  .get('/topContributor', content.onTopContributor)
  .get('/mostRecentUserContent', content.onUserMostRecentContent)
  .get('/userMostPopular', content.onUserMostPopularContent)
  .get('/userContentStats', content.onUserContentStats)
  .get('/byId', content.onGetContentById)
  .get('/:type', content.onGetContentWithType)
  .get('/', content.onGetContent)
  .post('/', content.onCreateContent)
  .put('/', content.onUpdateContent)
  .post('/like', content.onLikeContent)
  .post('/view', content.onViewContent);

export default router;
