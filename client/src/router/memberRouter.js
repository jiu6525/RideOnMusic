import MemberJoin from '@/views/member/MemberJoin.vue'

import MemberMypage from '@/views/member/MemberMypage.vue'

import MemberChangePwd from '@/views/member/MemberChangePwd.vue'







export default[{

  path: '/member',

  name: 'member',

  redirect: {name: 'join'},

  children: [

    {

      path: 'join',

      name: 'memberjoin',

      component: MemberJoin

    },

    {

      path: 'mypage',

      name: 'membermypage',

      component: MemberMypage

    },

    {

      path: 'updatePwd',

      name: 'memberchangepwd',

      component: MemberChangePwd

    }

  ]

}]