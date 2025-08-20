import * as React from "react"
import { motion } from "framer-motion"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { RippleButton } from "@/components/animations/micro-interactions"

const animatedButtonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        primary: "bg-pure-red text-white hover:bg-red-700 shadow-red",
        secondary: "bg-dark-gray text-white hover:bg-gray-800",
        ghost: "bg-transparent text-dark-gray border border-dark-gray hover:bg-dark-gray hover:text-white",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        magnetic: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8",
        icon: "h-10 w-10",
      },
      animation: {
        none: "",
        ripple: "",
        magnetic: "",
        bounce: "",
        pulse: "",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "none",
    },
  }
)

export interface AnimatedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof animatedButtonVariants> {
  asChild?: boolean
  loading?: boolean
  rippleEffect?: boolean
  magneticEffect?: boolean
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation = "none",
    asChild = false, 
    loading = false,
    rippleEffect = false,
    magneticEffect = false,
    children,
    onClick,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    // 动画变体
    const animationVariants = {
      none: {},
      bounce: {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { type: "spring", stiffness: 400, damping: 17 }
      },
      pulse: {
        whileHover: { scale: [1, 1.05, 1] },
        transition: { duration: 0.3, repeat: Infinity, repeatType: "reverse" as const }
      }
    }

    const buttonContent = (
      <>
        {loading && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
        
        <motion.div
          className="flex items-center justify-center"
          animate={{ opacity: loading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>

        {/* 悬停时的发光效果 */}
        {variant === "magnetic" && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            style={{ filter: "blur(10px)" }}
          />
        )}
      </>
    )

    // 如果启用涟漪效果
    if (rippleEffect && !asChild) {
      return (
        <RippleButton
          className={cn(animatedButtonVariants({ variant, size, className }))}
          onClick={onClick}
          disabled={isDisabled}
          {...props}
        >
          {buttonContent}
        </RippleButton>
      )
    }

    // 如果启用磁性效果
    if (magneticEffect && !asChild) {
      return (
        <motion.button
          ref={ref}
          className={cn(animatedButtonVariants({ variant, size, className }))}
          onClick={onClick}
          disabled={isDisabled}
          onMouseMove={(e) => {
            if (isDisabled) return
            const rect = e.currentTarget.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            const deltaX = (e.clientX - centerX) * 0.15
            const deltaY = (e.clientY - centerY) * 0.15
            
            e.currentTarget.style.transform = `translate(${deltaX}px, ${deltaY}px)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0px, 0px)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          {...props}
        >
          {buttonContent}
        </motion.button>
      )
    }

    // 标准动画按钮
    return (
      <motion.div
        {...animationVariants[animation || "none"]}
      >
        <Comp
          className={cn(animatedButtonVariants({ variant, size, className }))}
          ref={ref}
          onClick={onClick}
          disabled={isDisabled}
          {...props}
        >
          {buttonContent}
        </Comp>
      </motion.div>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton, animatedButtonVariants }