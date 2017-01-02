// in index.html, add a script tag <script src="https://npmcdn.com/parse/dist/parse.js">

Parse.initialize("myAppId");
Parse.serverURL = 'https://parse-server-flight846.herokuapp.com/parse';

var Order = Parse.Object.extend("Order");
var order = new Order();

order.set("order_id", "OI_1234");
order.set("amount", 112.3);
order.set("date", new Date('2016-02-01'));
order.save(null, {
	success: function success(obj) {
	  console.log("Order created with id " + obj.id);

		var Item = Parse.Object.extend("Item");
		var items = [
			{"item_id": 1, "name": "hat", "cost": 12.3, "order": order},
			{"item_id": 2, "name": "shoes", "cost": 50, "order": order},
			{"item_id": 3, "name": "gloves", "cost": 50, "order": order},
		];
		for (var i = 0; i < items.length; i++) {
      var item = new Item();
			item.save(items[i], {
				success: function success(obj) {
      	  console.log("Item created with id " + obj.id);
				}
			});
		}
	},
	error: function (obj, err) {
		console.log(err);
	}
});

// create an empty row
var Post = Parse.Object.extend("Post");

// create a new class with new key/value pair columns
var post = new Post();
// post.set("body", "Hello, my name is Yazid");
// post.set("tags", ["first-post", "welcome"]);
// post.set("numComments", 0);

var data = {
	"body": "Hello, my name is Yazid",
	"tags": ["second-post", "welcome"],
	"numComments": 0,
	"author": "Yazid Ismail"
}
// save into data instance into post object database
post.save(data, {
	success: function (obj) {
		console.log("Successful saved: " + obj.id); // "Successful saved: undefined"

		// One-to-One relationship
		var Comment = Parse.Object.extend("Comment");
		var comment = new Comment();
		comment.set("message", "This is a new comment for the post");
		//
		comment.set("parent", post);
		comment.save(null, {
			success: function (obj) {
				console.log("Saved comment " + obj.id);
				// one to many
				var comments = post.relation("comments")
				comments.add(comment);
				post.save();
			},
			error: function (obj, err) {
				console.log(err);
			}
		});

		// get object
		var q = new Parse.Query("Post");
		q.get(post.id, {
			success: function (obj) {
				console.log("Successful got: " + obj.id);
				// after get, we update the object
				obj.set("body", "This is the updated message");
				obj.increment("numComments");
				obj.add("tags", "updated-post");

				obj.save(null, {
					success: function (obj) {
						console.log("Successfully edited: " + obj.id);

						// delete column
						obj.unset("numComments");
						obj.save();

						// delete a row
						// obj.destroy({
						// 	success: function (obj) {
						// 		console.log("Successfully destroyed: " + obj.id);
						// 	},
						// 	error: function (obj, error) {
						// 		console.log(err);
						// 	}
						// });
					},
					error: function (obj, err) {
						console.log(err);
					}
				});
			},
			error: function (obj, err) {
				console.log(err);
			}
		});
	},
	error: function (obj, err) {
		console.log(err)
	}
});
