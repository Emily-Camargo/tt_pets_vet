import React, { memo } from 'react'
import { IMaskInput } from 'react-imask'
import { MaskCustomProps } from './interface'

const MaskCustom = React.forwardRef<HTMLInputElement, MaskCustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, mask, ...other } = props
    return (
      <IMaskInput
        {...other}
        overwrite
        mask={mask}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
      />
    )
  },
)

export default memo(MaskCustom)
