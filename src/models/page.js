import generateModel from "./generateModel";

const schema = {
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  priority: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 1
  },
  crawler: {
    begin_crawling_posts_at: Date,
    latest_crawled_posts_at: Date,
    latest_post_time: Date
  }
};

export default generateModel({
  schema,
  modelName: "FacebookPage",
  collectionName: "pages"
});
