
const Post = require('../models/post');

exports.savePost = (req,res,next) => {
  debugger;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    creator: req.UserData.userId
  });
  post.save().then((createdpost) => {
    res.status(201).json({
      message : 'Post Added Successfully!',
      postId: createdpost._id
    });
  })
  .catch(() => {
    res.status(500).json({
      message: "Post Creation failed"
    })
  })
}

exports.updatePost = (req,res,next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    creator: req.UserData.userId
  });

  Post.updateOne({ _id: req.params.postId, creator: req.UserData.userId},post)
  .then((result) => {
    if(result.n > 0) {
      res.status(200).json({
        message: 'update Successful!'
      });
    } else {
      res.status(401).json({
        message: 'update UnSuccessful!'})
    }
  })
  .catch(() => {
    res.status(401).json({
      message: 'update UnSuccessful! as you are not authorized to edit this post'
    });
  })
}

exports.getPosts = (req,res,next ) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.Page;
  const postQuery = Post.find();
  let fetchedPosts = null;
  console.log('amol1');
  console.log(req.query);
  if(pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage -1))
    .limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message : 'Parcel Delivered',
        posts : fetchedPosts,
        maxPosts: count
      });
    })
    .catch(() => {
      res.status(500).json({
        message: "Fetching Posts Failed"
      });
    });
}

exports.getPost = (req,res,next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if(post){
        res.status(200).json(post);
      }else{
        res.status(404).json({message: "post not found"});
      }
    })
    .catch(() => {
      res.status(500).json({
        message: "Fetching Post Failed"
      });
    });
}

exports.deletePost = (req,res,next) => {
  console.log(req.params.id);
  Post.findByIdAndDelete({ _id: req.params.id, creator: req.UserData.userId})
  .then((result) => {
    if(result.n > 0) {
      res.statusCode(200).json({
        message: 'Delete Successful!'
      });
    }
  })
  .catch(() => {
    res.statusCode(401).json({
      message: 'Delete UnSuccessful! as you are not authorized to edit this post'
    });
  })
};
