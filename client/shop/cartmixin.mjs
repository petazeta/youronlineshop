const cartMixin = Sup => class extends Sup {
  constructor() {
    super()
    this.addRelationship(new this.constructor.linkerConstructor()) // items container
  }
  addItem(getLangBranch, item, quantity) {
    if (!quantity)
      quantity = 1
    quantity = window.parseInt(quantity)
    const cartItemMatch = this.getRelationship().getChild({id: item.props.id})
    if (cartItemMatch) {
      cartItemMatch.props.quantity += quantity
      if (cartItemMatch.props.quantity==0) {
        this.getRelationship().removeChild(cartItemMatch)
      }
      cartItemMatch.item = item // Update item (if lang item data changes this item lang data changes)
    }
    else {
      const cartItem = new this.constructor.nodeConstructor({id: item.props.id, quantity: quantity})
      cartItem.item = item
      this.getRelationship().addChild(cartItem)
    }
    this.dispatchEvent("cart item", item)
  }
}

export const sumTotal = children => children.reduce(
  (tot, child)=>{
    const quantity = ('quantity' in child.props) ? child.props.quantity : 1
    const price = ('price' in child.props) ? child.props.price : 0
    return tot + quantity * price
  }, 0
)

export default cartMixin