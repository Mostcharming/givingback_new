interface SubContent {
  title?: string
  content?: string[]
  list?: string[]
  content2?: string[]
}

interface SubSection {
  title?: string
  content?: string[]
  subContent?: SubContent[]
}

export interface PrivacyPolicySection {
  main?: string
  mainContent?: string[]
  sub: SubSection[]
}
