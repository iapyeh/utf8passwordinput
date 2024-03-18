/*
Using a text-input HTML element to mimic password-input.
Please see demo.html for usage.

By: iapyeh@gmail.com
2024/3/12 
    go public
2024/3/13
    refine: set mininum length to 1 for deleteContentForward 
2024/3/19
    refine: user could set "star" (placeholder "*") and "star" could be an unicode
*/
class Utf8PasswordInput{
    constructor(inputEle,seeEle){
        this.inputEle = inputEle
        this.seeEle = seeEle
        this.pwd = []
        this.see = false
        this.star = '*'
        //hooking event listeners for "input" element
        const self = this
        const fireUpdateEvent = ()=>{
            inputEle.dispatchEvent(new CustomEvent('update',{detail:self.value}))
        }
        const resetInputEleValue = (extraOffset)=>{
            const pos = inputEle.selectionStart + (extraOffset || 0)
            inputEle.value = self.getpwd(self.see)
            // reposition the cursor
            inputEle.selectionStart = pos
            inputEle.selectionEnd = pos          
        }
        inputEle.addEventListener('beforeinput',(evt)=>{
            if (evt.inputType=='deleteContentBackward'){
                self._pos = evt.target.selectionEnd
            }else if (evt.inputType == 'deleteContentForward'){
                self._pos = evt.target.selectionEnd
            }else if (evt.inputType == 'insertFromPaste'){
                self._pos = evt.target.selectionEnd
            }else if (evt.inputType == 'compositionend'){
                //this case dosen't happen
                self._pos = evt.target.selectionEnd
            }
        })
        inputEle.addEventListener('input', (evt)=>{
            if (self.see) return
            let pos,inserted,delLength,idx
            if (evt.inputType=='insertText'){
                pos = evt.target.selectionStart - evt.data.length
                idx = pos/self._starLen
                for(const char of evt.data){
                    self.pwd.splice(idx,0,char)
                    idx += 1
                }
                const extraOffset = (evt.data.length * self._starLen) - evt.data.length
                resetInputEleValue(extraOffset) 
                fireUpdateEvent()
            }else if (evt.inputType=='deleteContentBackward'){
                pos = evt.target.selectionStart
                const idx0 = pos/self._starLen
                const idx1 = self._pos/self._starLen
                delLength = idx1 - idx0
                self.pwd.splice(idx0,delLength)
                resetInputEleValue() 
                fireUpdateEvent()
            }else if (evt.inputType=='deleteContentForward'){
                pos = evt.target.selectionStart
                // testing on MacOS, Chrome, this is always 1
                delLength = 1
                idx = self._pos/self._starLen
                self.pwd.splice(idx,delLength)
                resetInputEleValue() 
                fireUpdateEvent()
            }else if (evt.inputType == 'insertFromPaste'){
                //most unicodes are inserted by paste, such as "😀"
                idx = self._pos/self._starLen
                inserted = inputEle.value.substring(self._pos,evt.target.selectionStart)
                let i = 0
                for(const char of inserted){
                    self.pwd.splice(idx+i,0,char)
                    i += 1
                }
                // help the cursor to posite correclty at the end of inserted text when self._starLen > 1 (eg.😀)
                const extraOffset = (i * self._starLen) - inserted.length
                resetInputEleValue(extraOffset)
                fireUpdateEvent()
            }else{
                // eg. historyUndo, insertCompositionText
            }
        })
        inputEle.addEventListener('compositionend', (evt)=>{
            //CKY chareactors are inputed 
            if (this.see) return
            let idx = (evt.target.selectionStart - evt.data.length)/self._starLen
            let i = 0
            for(const char of evt.data){
                self.pwd.splice(idx + i,0,char)
                i += 1
            }
            const extraOffset = (i * self._starLen) - evt.data.length
            resetInputEleValue(extraOffset)
            fireUpdateEvent()
        })
        // hooking event listeners for "see" element
        if (seeEle){
            const showPassword = (evt)=>{
                if (self.see) return //avoid double invoking by events
                self.see = true
                self._pos = inputEle.selectionStart
                inputEle.value = self.getpwd(self.see)
            }
            const hidePassword =  (evt)=>{
                if (!self.see) return //avoid double invoking by events
                self.value = inputEle.value
                self.see = false
                inputEle.value = self.getpwd(self.see)
                inputEle.focus()
                inputEle.selectionStart = self._pos
                inputEle.selectionEnd = self._pos
            }
            seeEle.addEventListener('pointerdown', showPassword)
            seeEle.addEventListener('pointerup',hidePassword)
        }
    }
    get value(){
        return this.getpwd(true)
    }
    set value(v){
        this.pwd = []
        for (let i=0;i<v.length;i++){
            this.pwd.push(v.substr(i,1))
        }
    }
    get star(){
        return this._star
    }
    set star(c){
        this._star = c
        this._starLen = c.length
    }
    getpwd(plain){
        let chars = []
        const self = this
        this.pwd.map((c)=>{
            if (plain){
                chars.push(c)
            }else{
                chars.push(self.star)
            }
        })
        return chars.join('')
    }
}
