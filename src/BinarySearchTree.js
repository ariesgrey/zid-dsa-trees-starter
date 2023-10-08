const Queue = require("./Queue");

class BinarySearchTree {
	constructor(key = null, value = null, parent = null) {
		this.key = key;
		this.value = value;
		this.parent = parent;
		this.left = null;
		this.right = null;
	}

	/* Inserts new node into the tree */
	insert(key, value) {
		// If the tree is empty, the key being inserted is the root node
		if (!this.key) {
			this.key = key;
			this.value = value;
		}
		// Else, start with root node: if the new node's key is less than the existing node's key...
		else if (key < this.key) {
			// If the existing node does not have a 'left' pointer...
			if (!this.left) {
				// Assign left pointer a new subtree with the given values
				this.left = new BinarySearchTree(key, value, this);
			}
			// If the existing node already has a left child, recursively call 'insert()' to add node further down the tree
			else {
				this.left.insert(key, value);
			}
		}
		// Else, if new node's key is greater than the existing node's key...
		else {
			// If the existing node does not have a 'right' pointer...
			if (!this.right) {
				// Assign right pointer a new subtree with the given values
				this.right = new BinarySearchTree(key, value, this);
			}
			// If the existing node already has a right child, recursively call 'insert()' to add node further down the tree
			else {
				this.right.insert(key, value);
			}
		}
	}

	/* Finds the node that matches a given key */
	find(key) {
		// If the node is at the root, return that value
		if (this.key === key) {
			return this.value;
		}
		// If the node's key is less than the root, and there is an existing left child...
		else if (key < this.key && this.left) {
			// Recursively call 'find()' to check further down the tree
			return this.left.find(key);
		}
		// If the node's key is greater than the root, and there is an existing right child...
		else if (key > this.key && this.right) {
			// Recursively call 'find()' to check further down the tree
			return this.right.find(key);
		}
		// If no match found, throw error
		else {
			throw new Error("Key Not Found");
		}
	}

	/* Removes the node that matches the given key */
	remove(key) {
		// If the node is at the root...
		if (this.key === key) {
			// If the node has 2 children...
			if (this.left && this.right) {
				// Find the node with the minimum value within its right branch, and assign its key and value to the node being removed
				const successor = this.right._findMin();
				this.key = successor.key;
				this.value = successor.value;
				// Recursively call 'remove()' for the original minimum value node
				successor.remove(successor.key);
			}
			// If the node only has a left child, replace it with its left child
			else if (this.left) {
				this._replaceWith(this.left);
			}
			// If the node only has a right child, replace it with its right child
			else if (this.right) {
				this._replaceWith(this.right);
			}
			// If the node has no children, simply remove it and any references to it by calling `this._replaceWith(null)`.
			else {
				this._replaceWith(null);
			}
		}
		// If the node's key is less than the root, and there is an existing left child...
		else if (key < this.key && this.left) {
			// Recursively call 'remove()' to check further down the tree
			this.left.remove(key);
		}
		// If the node's key is greater than the root, and there is an existing right child...
		else if (key > this.key && this.right) {
			// Recursively call 'remove()' to check further down the tree
			this.right.remove(key);
		}
		// If no match found, throw error
		else {
			throw new Error("Key Not Found");
		}
	}

	/* Replaces node with a given node */
	_replaceWith(node) {
		// If the node to replace has a parent...
		if (this.parent) {
			// If the node is the parent's left child, reassign the parent's 'left' pointer to the replacement node
			if (this === this.parent.left) {
				this.parent.left = node;
			}
			// If the node is the parent's right child, reassign the parent's 'right' pointer to the replacement node
			else if (this === this.parent.right) {
				this.parent.right = node;
			}

			// If the replacement node isn't null, set its parent value to the old node's parent value
			if (node) {
				node.parent = this.parent;
			}
		}
		// If the node to replace is the root node...
		else {
			// If the replacement node isn't null, simply assign the replacement node's values to the old node
			if (node) {
				this.key = node.key;
				this.value = node.value;
				this.left = node.left;
				this.right = node.right;
			}
			// If the replacement node is null, assign all values as null
			else {
				this.key = null;
				this.value = null;
				this.left = null;
				this.right = null;
			}
		}
	}

	/* Finds the minimum value from a node's right subtree */
	_findMin() {
		// If the node doesn't have a left child (smaller value), return the node
		if (!this.left) {
			return this;
		}
		// Otherwise, recursively call 'findMin()' for the node's left child
		return this.left._findMin();
	}

	/* Depth-First Search: In-Order Traversal - array of values returned is sorted */
	dfsInOrder(values = []) {
		// First, process the left node recursively
		if (this.left) {
			values = this.left.dfsInOrder(values);
		}

		// Next, process the current node
		values.push(this.value);

		// Finally, process the right node recursively
		if (this.right) {
			values = this.right.dfsInOrder(values);
		}

		return values;
	}

	/* Depth-First Search: Pre-Order Traversal */
	dfsPreOrder(values = []) {
		// First, process the current node
		values.push(this.value);

		// Next, process the left node recursively
		if (this.left) {
			values = this.left.dfsPreOrder(values);
		}

		// Finally, process the right node recursively
		if (this.right) {
			values = this.right.dfsPreOrder(values);
		}

		return values;
	}

	/* Depth-First Search: Post-Order Traversal */
	dfsPostOrder(values = []) {
		// First, process the left node recursively
		if (this.left) {
			values = this.left.dfsPostOrder(values);
		}

		// Next, process the right node recursively
		if (this.right) {
			values = this.right.dfsPostOrder(values);
		}

		// Finally, process the current node
		values.push(this.value);

		return values;
	}

	/* Breadth-First Search */
	bfs(tree, values = []) {
		const queue = new Queue();
		// Start the traversal by adding 'tree' (root node) to the queue
		queue.enqueue(tree);
		// Remove node from the queue
		let node = queue.dequeue();

		// While the node removed isn't null...
		while (node) {
			// Add the node's value to an array
			values.push(node.value);

			// If the node has a left child, add to the queue
			if (node.left) {
				queue.enqueue(node.left);
			}

			// If the node has a right child, add to the queue
			if (node.right) {
				queue.enqueue(node.right);
			}
			// Remove next node from the queue
			node = queue.dequeue();
		}

		return values;
	}

	/* Returns the height of a tree */
	getHeight(currentHeight = 0) {
		// Base case
		// If the current node doesn't have any children, return 'currentHeight'
		if (!this.left && !this.right) return currentHeight;

		// Recursive case
		// Calculate new height value
		const newHeight = currentHeight + 1;

		// If the current node has no left child, recurse down the right subtree only, passing in 'newHeight'
		if (!this.left) return this.right.getHeight(newHeight);

		// If the current node has no right child, recurse down the left subtree only, passing in 'newHeight'
		if (!this.right) return this.left.getHeight(newHeight);

		// If both children exist, recurse down both subtrees, passing in 'newHeight'...
		const leftHeight = this.left.getHeight(newHeight);
		const rightHeight = this.right.getHeight(newHeight);
		// Return the greater of the two heights
		return Math.max(leftHeight, rightHeight);
	}

	/* Returns 'true' if this given binary tree is a BST, and 'false' otherwise */
	isBST() {
		// Use 'dfsInOrder() to traverse the tree
		const values = this.dfsInOrder();

		// Check if the values returned are sorted
		for (let i = 1; i < values.length; i++) {
			// Compare current and previous values, return 'false' if any are not in increasing order
			if (values[i] < values[i - 1]) {
				return false;
			}
		}

		return true;
	}

	/* Returns the 'k'th largest value within a tree */
	findKthLargestValue(k) {
		// Use 'dfsInOrder() to traverse the tree
		const values = this.dfsInOrder();
		// Calculate desired index - 'k' from the end
		const kthIndex = values.length - k;

		// Ensure the index is within the bounds of the array
		if (kthIndex >= 0) {
			return values[kthIndex];
		} else {
			console.error("k value exceeds the size of the BST");
		}
	}
}
