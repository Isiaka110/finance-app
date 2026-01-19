using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hali.Api.Models
{
    public class HaliTask
    {
        [Key]
        public int Id { get; set; }
        [Required, StringLength(200)]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public Priority Priority { get; set; }
        public TaskStatus Status { get; set; } = TaskStatus.Pending;
        
        public int AssigneeId { get; set; }
        [ForeignKey("AssigneeId")]
        public User? Assignee { get; set; }

        public int CreatorId { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}