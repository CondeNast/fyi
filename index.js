module.exports = robot => {
  robot.log('Yay, the robot was loaded!')

  robot.on('repository.created', async context => {
    context.log(`new repo: ${context.payload.repository.name} created by ${context.payload.sender.login}`)


    //how to get repo info
    // let { data: {id: fyisRepoId } } = await context.github.repos.get({
    //   owner: 'CondeNast',
    //   repo: 'fyis'})
    // console.log(context.payload.organization.login, context.payload.repository.name, fyisRepoId)

    //how to create an issue
    const params = context.issue({
        owner: 'CondeNast',
        repo: 'fyis',
      title: `Request FYI for new repo: ${context.payload.repository.name}`
    })
    // console.log(params)
    return context.github.issues.create(params)

    //how to create a comment for an issue (works in issue.created event)
    // const params = context.issue({body: 'Hello World!'})
    // return context.github.issues.createComment(params)

  });
}
