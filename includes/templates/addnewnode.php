<div id="addnewnodetp">
		<table>
			<tbody>
				<tr>
					<td>
						<table>
								<tr>
									<td style="padding-left:5px" data-js='
										if (thisNode.properties.id && thisNode.parentNode.properties.childunique==1) thisElement.style.display="none"; //Just one child: it is not needed
										if (thisNode.parentNode.properties.childtablelocked==1) thisElement.style.display="none"; //It is not posible to add new nodes from a selection relationship
									'>
											<?php require('addnode.php'); ?>
									</td>
									<td data-js='
										if (thisNode.parentNode.properties.childunique==1 && thisNode.properties.id) thisElement.style.display="none"; //no plus posible
										if (!(thisNode.parentNode.partnerNode)) thisElement.style.display="none"; //no link
									'>
										<?php	require('addnodelink.php'); ?>
									</td>
								</tr>
							</table>
					</td>
				</tr>
			</tbody>
		</table>
</div>
