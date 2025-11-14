/**
 * Supabase 数据库类型定义
 * 基于 migrations/001_initial_schema.sql
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'admin' | 'user'
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: 'admin' | 'user'
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'admin' | 'user'
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          name: string
          address: string
          phone: string
          hours: string
          description: string | null
          latitude: number | null
          longitude: number | null
          dianping_url: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          phone: string
          hours: string
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          dianping_url?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          phone?: string
          hours?: string
          description?: string | null
          latitude?: number | null
          longitude?: number | null
          dianping_url?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          name: string
          category: 'main' | 'side' | 'drink'
          price: number
          description: string | null
          spicy_level: number
          is_bestseller: boolean
          image_url: string | null
          sort_order: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'main' | 'side' | 'drink'
          price: number
          description?: string | null
          spicy_level?: number
          is_bestseller?: boolean
          image_url?: string | null
          sort_order?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'main' | 'side' | 'drink'
          price?: number
          description?: string | null
          spicy_level?: number
          is_bestseller?: boolean
          image_url?: string | null
          sort_order?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      franchise_applications: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          city: string
          message: string | null
          status: 'pending' | 'contacted' | 'rejected' | 'partnered'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          email: string
          city: string
          message?: string | null
          status?: 'pending' | 'contacted' | 'rejected' | 'partnered'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          email?: string
          city?: string
          message?: string | null
          status?: 'pending' | 'contacted' | 'rejected' | 'partnered'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          page: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          page: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          page?: string
          created_at?: string
          updated_at?: string
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          message: string
          status: 'unread' | 'read' | 'replied'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          message: string
          status?: 'unread' | 'read' | 'replied'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          status?: 'unread' | 'read' | 'replied'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brand_gallery: {
        Row: {
          id: string
          image_url: string
          alt_text: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          image_url: string
          alt_text: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          image_url?: string
          alt_text?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          name: string
          role: string
          content: string
          rating: number
          avatar: string
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          content: string
          rating?: number
          avatar: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          content?: string
          rating?: number
          avatar?: string
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      menu_categories: {
        Row: {
          id: string
          name: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      menu_tips: {
        Row: {
          id: string
          content: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contact_info: {
        Row: {
          id: string
          icon: string
          label: string
          value: string
          link: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          icon: string
          label: string
          value: string
          link?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          icon?: string
          label?: string
          value?: string
          link?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      footer_config: {
        Row: {
          id: string
          brand_name: string
          brand_description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_name: string
          brand_description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_name?: string
          brand_description?: string
          created_at?: string
          updated_at?: string
        }
      }
      franchise_benefits: {
        Row: {
          id: string
          icon: string
          title: string
          description: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          icon: string
          title: string
          description: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          icon?: string
          title?: string
          description?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      franchise_requirements: {
        Row: {
          id: string
          content: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      franchise_process: {
        Row: {
          id: string
          step_number: number
          title: string
          description: string
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          step_number: number
          title: string
          description: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          step_number?: number
          title?: string
          description?: string
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_recent_application: {
        Args: {
          p_email: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 便捷类型别名
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Store = Database['public']['Tables']['stores']['Row']
export type MenuItem = Database['public']['Tables']['menu_items']['Row']
export type MenuCategory = Database['public']['Tables']['menu_categories']['Row']
export type MenuTip = Database['public']['Tables']['menu_tips']['Row']
export type ContactInfo = Database['public']['Tables']['contact_info']['Row']
export type FooterConfig = Database['public']['Tables']['footer_config']['Row']
export type FranchiseBenefit = Database['public']['Tables']['franchise_benefits']['Row']
export type FranchiseRequirement = Database['public']['Tables']['franchise_requirements']['Row']
export type FranchiseProcess = Database['public']['Tables']['franchise_process']['Row']
export type FranchiseApplication = Database['public']['Tables']['franchise_applications']['Row']
export type SiteSetting = Database['public']['Tables']['site_settings']['Row']
export type ContactSubmission = Database['public']['Tables']['contact_submissions']['Row']
export type BrandGalleryImage = Database['public']['Tables']['brand_gallery']['Row']
export type Testimonial = Database['public']['Tables']['testimonials']['Row']

// Insert 类型
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type StoreInsert = Database['public']['Tables']['stores']['Insert']
export type MenuItemInsert = Database['public']['Tables']['menu_items']['Insert']
export type MenuCategoryInsert = Database['public']['Tables']['menu_categories']['Insert']
export type MenuTipInsert = Database['public']['Tables']['menu_tips']['Insert']
export type ContactInfoInsert = Database['public']['Tables']['contact_info']['Insert']
export type FooterConfigInsert = Database['public']['Tables']['footer_config']['Insert']
export type FranchiseBenefitInsert = Database['public']['Tables']['franchise_benefits']['Insert']
export type FranchiseRequirementInsert = Database['public']['Tables']['franchise_requirements']['Insert']
export type FranchiseProcessInsert = Database['public']['Tables']['franchise_process']['Insert']
export type FranchiseApplicationInsert = Database['public']['Tables']['franchise_applications']['Insert']
export type SiteSettingInsert = Database['public']['Tables']['site_settings']['Insert']
export type ContactSubmissionInsert = Database['public']['Tables']['contact_submissions']['Insert']
export type BrandGalleryImageInsert = Database['public']['Tables']['brand_gallery']['Insert']
export type TestimonialInsert = Database['public']['Tables']['testimonials']['Insert']

// Update 类型
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type StoreUpdate = Database['public']['Tables']['stores']['Update']
export type MenuItemUpdate = Database['public']['Tables']['menu_items']['Update']
export type MenuCategoryUpdate = Database['public']['Tables']['menu_categories']['Update']
export type MenuTipUpdate = Database['public']['Tables']['menu_tips']['Update']
export type ContactInfoUpdate = Database['public']['Tables']['contact_info']['Update']
export type FooterConfigUpdate = Database['public']['Tables']['footer_config']['Update']
export type FranchiseBenefitUpdate = Database['public']['Tables']['franchise_benefits']['Update']
export type FranchiseRequirementUpdate = Database['public']['Tables']['franchise_requirements']['Update']
export type FranchiseProcessUpdate = Database['public']['Tables']['franchise_process']['Update']
export type FranchiseApplicationUpdate = Database['public']['Tables']['franchise_applications']['Update']
export type SiteSettingUpdate = Database['public']['Tables']['site_settings']['Update']
export type ContactSubmissionUpdate = Database['public']['Tables']['contact_submissions']['Update']
export type BrandGalleryImageUpdate = Database['public']['Tables']['brand_gallery']['Update']
export type TestimonialUpdate = Database['public']['Tables']['testimonials']['Update']

// 枚举类型
export type UserRole = 'admin' | 'user'
export type ApplicationStatus = 'pending' | 'contacted' | 'rejected' | 'partnered'
export type ContactStatus = 'unread' | 'read' | 'replied'
