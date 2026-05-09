'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

type FieldDef = {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
}

type FormBuilderProps<T extends z.ZodType> = {
  schema: T
  fields: FieldDef[]
  onSubmit: (data: z.infer<T>) => void | Promise<void>
  submitLabel?: string
}

export function FormBuilder<T extends z.ZodType>({
  schema,
  fields,
  onSubmit,
  submitLabel = 'Enviar',
}: FormBuilderProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<T>>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            id={field.name}
            type={field.type ?? 'text'}
            placeholder={field.placeholder}
            {...register(field.name as never)}
          />
          {errors[field.name] && (
            <span style={{ color: 'red', fontSize: '0.8rem' }}>
              {(errors[field.name] as { message?: string })?.message}
            </span>
          )}
        </div>
      ))}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : submitLabel}
      </button>
    </form>
  )
}
