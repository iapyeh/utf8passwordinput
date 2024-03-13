/*
Using a text-input HTML element to mimic password-input.
Please see demo.html for usage.

By: iapyeh@gmail.com
2024/3/12 
    go public
2024/3/13
    refine: set mininum length to 1 for deleteContentForward 
*/
class Utf8PasswordInput{
    constructor(inputEle,seeEle){
        this.inputEle = inputEle
        this.seeEle = seeEle
        this.pwd = []
        this.see = false
        //hook listeners
        const self = this
        const fireUpdateEvent = ()=>{
            inputEle.dispatchEvent(new CustomEvent('update',{detail:self.value}))
        }
        inputEle.addEventListener('beforeinput',(evt)=>{
            if (evt.inputType=='deleteContentBackward'){
                self._pos = evt.target.selectionEnd
            }else if (evt.inputType == 'deleteContentForward'){
                self._pos = evt.target.selectionEnd
            }else if (evt.inputType == 'insertFromPaste'){
                self._pos = evt.target.selectionEnd
            }
        })
        inputEle.addEventListener('input', (evt)=>{
            if (self.see) return
            let pos,inserted,delLength
            if (evt.inputType=='insertText'){
                pos = evt.target.selectionStart - 1
                for(let i=0;i<evt.data.length;i++){
                    self.pwd.splice(pos,0,evt.data.substr(i,1))
                    pos += 1
                }
                inputEle.value = self._getpwd(self.see)
                fireUpdateEvent()
                // reposition cursor
                inputEle.selectionStart = pos
                inputEle.selectionEnd = pos
            }else if (evt.inputType=='deleteContentBackward'){
                pos = evt.target.selectionStart
                delLength = self._pos - pos
                self.pwd.splice(pos,delLength)
                inputEle.value = self._getpwd(self.see)
                fireUpdateEvent()
            }else if (evt.inputType=='deleteContentForward'){
                pos = evt.target.selectionStart
                delLength = Math.max(1,pos - self._pos)
                self.pwd.splice(pos,delLength)
                inputEle.value = self._getpwd(self.see)
                fireUpdateEvent()
            }else if (evt.inputType == 'insertFromPaste'){
                pos = evt.target.selectionStart
                inserted = inputEle.value.substring(self._pos,pos)
                for(let i=0;i<inserted.length;i++){
                    self.pwd.splice(self._pos+i,0,inserted.substr(i,1))
                }
                inputEle.value = self._getpwd(self.see)
                // reposition cursor
                inputEle.selectionStart = pos
                inputEle.selectionEnd = pos           
                fireUpdateEvent()
            }else{
                //eg. historyUndo, insertCompositionText
                //console.log(evt.inputType)
            }
        })
        inputEle.addEventListener('compositionend', (evt)=>{
            if (this.see) return
            let dataLength = evt.data.length
            let pos = evt.target.selectionStart - dataLength 
            for(let i=0;i<evt.data.length;i++){
                self.pwd.splice(pos,0,evt.data.substr(i,1))
                pos += 1
            }
            inputEle.value = self._getpwd(self.see)
            // reposition cursor
            inputEle.selectionStart = pos
            inputEle.selectionEnd = pos
            fireUpdateEvent()
        })
        if (seeEle){
            const showPassword = (evt)=>{
                if (self.see) return //avoid double invoking by events
                self.see = true
                self._pos = inputEle.selectionStart
                inputEle.value = self._getpwd(self.see)
            }
            const hidePassword =  (evt)=>{
                if (!self.see) return //avoid double invoking by events
                self.value = inputEle.value
                self.see = false
                inputEle.value = self._getpwd(self.see)
                inputEle.focus()
                inputEle.selectionStart = self._pos
                inputEle.selectionEnd = self._pos
            }
            seeEle.addEventListener('mousedown', showPassword)
            seeEle.addEventListener('mouseup',hidePassword)
            seeEle.addEventListener('pointerdown', showPassword)
            seeEle.addEventListener('pointerup',hidePassword)
        }
    }
    _getpwd(plain){
        let star = []
        this.pwd.map((c)=>{
            if (plain){
                star.push(c)
            }else{
                star.push('*')
            }
        })
        return star.join('')
    }
    get value(){
        return this._getpwd(true)
    }
    set value(v){
        this.pwd = []
        for (let i=0;i<v.length;i++){
            this.pwd.push(v.substr(i,1))
        }
    }
}
