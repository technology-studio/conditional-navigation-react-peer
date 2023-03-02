/**
 * @Author: Erik Slovak <erik.slovak@technologystudio.sk>
 * @Date: 2021-08-26T18:08:45+02:00
 * @Copyright: Technology Studio
**/

class BackHandlerManager {
  handlerList: (() => boolean)[] = []

  register (onBackRequest: () => boolean): () => void {
    this.handlerList.push(onBackRequest)

    return () => {
      this.handlerList = this.handlerList.filter(handler => handler !== onBackRequest)
    }
  }
}

export const backHandlerManager = new BackHandlerManager()
